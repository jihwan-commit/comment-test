// comment-test API — Supabase Edge Function 하나로 geulim 모양의 REST 를 제공한다.
// 배포: supabase functions deploy api --no-verify-jwt
// 호출: https://<ref>.supabase.co/functions/v1/api/sales-orders?page=1&take=20
//
// 라우트
//   GET    /sales-orders                      목록(status·search·컬럼별 검색·orderBy/orderDirection·page·take) + 합계
//   GET    /sales-orders/delete-precheck      삭제 가능 여부 (항상 가능)
//   GET    /sales-orders/:id                  상세 (sizes 포함)
//   PATCH  /sales-orders/:id                  수정
//   DELETE /sales-orders?ids=a,b              삭제
//   GET    /so-size/sales-order/:salesOrderId 사이즈 행
//   POST   /so-size                           { salesOrderId, sizeName, isBasic? }
//   DELETE /so-size/:id
//   GET    /comments?targetType=&targetIds=a,b[&fieldPath=]   스레드+댓글
//   POST   /comments                          { targetType, targetId, fieldPath, authorId, authorName, body, valueSnapshot }
//   PATCH  /comments/:id                      { body }
//   DELETE /comments/:id                      soft delete
//   PATCH  /comment-threads/:id/resolve
//   PATCH  /comment-threads/:id/reopen

import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-organization-code",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
const fail = (message: string, status = 400) => json({ message }, status);

// snake_case ↔ camelCase
const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const toSnake = (s: string) => s.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
const camelKeys = <T>(row: Record<string, unknown>): T =>
  Object.fromEntries(
    Object.entries(row).map(([k, v]) => [
      toCamel(k),
      Array.isArray(v) ? v.map((x) => (x && typeof x === "object" ? camelKeys(x as Record<string, unknown>) : x)) : v,
    ]),
  ) as T;
const snakeKeys = (body: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(body).map(([k, v]) => [toSnake(k), v]));

// ───────────── sales-orders ─────────────

const SORTABLE = new Set([
  "style_number", "buyer_name", "brand_name", "order_qty", "prod_qty",
  "order_amount", "prod_amount", "delivery_date", "created_at", "status",
]);

// 컬럼별 부분일치 검색(geulim 검색 행) + 통합 키워드(search)
const TEXT_FILTERS: Record<string, string> = {
  styleNumber: "style_number", buyerName: "buyer_name", brandName: "brand_name",
  styleDescription: "style_description", sewingFactoryName: "sewing_factory_name",
  sewingFactoryCountry: "sewing_factory_country", season: "season", teamName: "team_name",
  gender: "gender", category: "category", designer: "designer",
};
// deno-lint-ignore no-explicit-any
function applyFilters<T extends { in: any; ilike: any; or: any }>(
  query: T, q: URLSearchParams, { withStatus = true } = {},
): T {
  const status = q.get("status");
  if (withStatus && status) query = query.in("status", status.split(","));
  for (const [param, col] of Object.entries(TEXT_FILTERS)) {
    const v = q.get(param)?.trim();
    if (v) query = query.ilike(col, `%${v}%`);
  }
  const search = q.get("search")?.trim();
  if (search) {
    const like = `%${search}%`;
    query = query.or(
      `style_number.ilike.${like},buyer_name.ilike.${like},brand_name.ilike.${like},sewing_factory_name.ilike.${like}`,
    );
  }
  return query;
}

async function listSalesOrders(q: URLSearchParams) {
  let query = applyFilters(db.from("sales_order").select("*", { count: "exact" }), q);

  const sort = toSnake(q.get("sort") ?? q.get("orderBy") ?? "createdAt");
  const asc = (q.get("order") ?? q.get("orderDirection") ?? "desc").toLowerCase() === "asc";
  query = query.order(SORTABLE.has(sort) ? sort : "created_at", { ascending: asc });

  const paged = q.has("page") || q.has("take");
  const page = Math.max(1, Number(q.get("page")) || 1);
  const take = paged ? Math.max(1, Number(q.get("take")) || 20) : 1000;
  query = query.range((page - 1) * take, page * take - 1);

  const { data, count, error } = await query;
  if (error) return fail(error.message, 500);

  // 합계는 필터된 전체 기준 — 엣지케이스 2번(조회 조건에 따라 바뀌는 값)
  const { data: all, error: e2 } = await applyFilters(
    db.from("sales_order").select("order_qty, prod_qty, order_amount, prod_amount, buyer_name"), q);
  if (e2) return fail(e2.message, 500);
  const sum = (k: string) => all!.reduce((s, r) => s + Number((r as Record<string, unknown>)[k] ?? 0), 0);

  // 임시저장 건수는 상태 탭과 무관하게(텍스트 검색만 적용) 센다 — 진행 탭에서도 "임시저장 (n)" 이 보이도록
  const { count: draftCount } = await applyFilters(
    db.from("sales_order").select("id", { count: "exact", head: true }), q, { withStatus: false }).eq("status", "DRAFT");

  const totalCount = count ?? 0;
  return json({
    salesOrders: data!.map(camelKeys),
    currentPage: page,
    totalCount,
    totalPage: Math.max(1, Math.ceil(totalCount / take)),
    totalBuyerQuantity: new Set(all!.map((r) => r.buyer_name)).size,
    totalOrderQuantity: sum("order_qty"),
    totalProdQuantity: sum("prod_qty"),
    totalOrderAmount: sum("order_amount"),
    totalProdAmount: sum("prod_amount"),
    draftCount: draftCount ?? 0,
  });
}

async function getSalesOrder(id: string) {
  const { data, error } = await db
    .from("sales_order")
    .select("*, sizes:so_size(*)")
    .eq("id", id)
    .order("sort_order", { referencedTable: "so_size" })
    .maybeSingle();
  if (error) return fail(error.message, 500);
  if (!data) return fail("not found", 404);
  return json(camelKeys(data));
}

async function patchSalesOrder(id: string, body: Record<string, unknown>) {
  const { id: _i, sizes: _s, createdAt: _c, updatedAt: _u, ...rest } = body;
  const { data, error } = await db.from("sales_order").update(snakeKeys(rest)).eq("id", id).select().maybeSingle();
  if (error) return fail(error.message, 400);
  if (!data) return fail("not found", 404);
  return json(camelKeys(data));
}

async function deleteSalesOrders(ids: string[]) {
  if (ids.length === 0) return fail("ids required");
  const { error } = await db.from("sales_order").delete().in("id", ids);
  if (error) return fail(error.message, 500);
  return new Response(null, { status: 204, headers: CORS });
}

// ───────────── so-size ─────────────

async function listSizes(salesOrderId: string) {
  const { data, error } = await db.from("so_size").select("*").eq("sales_order_id", salesOrderId).order("sort_order");
  if (error) return fail(error.message, 500);
  return json(data!.map(camelKeys));
}

async function createSize(body: Record<string, unknown>) {
  const { salesOrderId, sizeName, isBasic = false } = body as { salesOrderId?: string; sizeName?: string; isBasic?: boolean };
  if (!salesOrderId || !sizeName) return fail("salesOrderId, sizeName required");
  const { data: last } = await db.from("so_size").select("sort_order").eq("sales_order_id", salesOrderId)
    .order("sort_order", { ascending: false }).limit(1).maybeSingle();
  const { data, error } = await db.from("so_size")
    .insert({ sales_order_id: salesOrderId, size_name: sizeName, is_basic: isBasic, sort_order: (last?.sort_order ?? 0) + 1 })
    .select().single();
  if (error) return fail(error.message, 400);
  return json(camelKeys(data), 201);
}

async function deleteSize(id: string) {
  const { error } = await db.from("so_size").delete().eq("id", id);
  if (error) return fail(error.message, 500);
  return new Response(null, { status: 204, headers: CORS });
}

// ───────────── comments ─────────────

async function listComments(q: URLSearchParams) {
  const targetType = q.get("targetType");
  const targetIds = q.get("targetIds")?.split(",").filter(Boolean) ?? [];
  if (!targetType || targetIds.length === 0) return fail("targetType, targetIds required");
  let query = db.from("comment_thread")
    .select("*, comments:comment(*)")
    .eq("target_type", targetType)
    .in("target_id", targetIds)
    .is("comments.deleted_at", null)
    .order("created_at", { referencedTable: "comment" });
  const fieldPath = q.get("fieldPath");
  if (fieldPath !== null) query = query.eq("field_path", fieldPath);
  const { data, error } = await query;
  if (error) return fail(error.message, 500);
  return json(data!.map(camelKeys));
}

async function createComment(body: Record<string, unknown>) {
  const { targetType, targetId, fieldPath = "", authorId, authorName = null, body: text, valueSnapshot = null } = body as Record<string, string | null | undefined>;
  if (!targetType || !targetId || !authorId || !text) return fail("targetType, targetId, authorId, body required");
  const { data: thread, error: e1 } = await db.from("comment_thread")
    .upsert({ target_type: targetType, target_id: targetId, field_path: fieldPath ?? "" }, { onConflict: "target_type,target_id,field_path" })
    .select().single();
  if (e1) return fail(e1.message, 400);
  const { data, error } = await db.from("comment")
    .insert({ thread_id: thread.id, author_id: authorId, author_name: authorName, body: text, value_snapshot: valueSnapshot })
    .select().single();
  if (error) return fail(error.message, 400);
  return json({ thread: camelKeys(thread), comment: camelKeys(data) }, 201);
}

async function patchComment(id: string, body: Record<string, unknown>) {
  const { data, error } = await db.from("comment").update({ body: body.body }).eq("id", id).select().maybeSingle();
  if (error) return fail(error.message, 400);
  if (!data) return fail("not found", 404);
  return json(camelKeys(data));
}

async function deleteComment(id: string) {
  const { error } = await db.from("comment").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) return fail(error.message, 500);
  return new Response(null, { status: 204, headers: CORS });
}

async function setThreadResolved(id: string, resolved: boolean) {
  const { data, error } = await db.from("comment_thread")
    .update({ resolved_at: resolved ? new Date().toISOString() : null }).eq("id", id).select().maybeSingle();
  if (error) return fail(error.message, 400);
  if (!data) return fail("not found", 404);
  return json(camelKeys(data));
}

// ───────────── router ─────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const url = new URL(req.url);
  // /functions/v1/api/<path> → <path>
  const path = url.pathname.replace(/^\/functions\/v1\/api/, "").replace(/^\/api/, "").replace(/\/$/, "") || "/";
  const seg = path.split("/").filter(Boolean);
  const m = req.method;
  const body = async () => (await req.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    if (seg[0] === "sales-orders") {
      if (seg.length === 1 && m === "GET") return listSalesOrders(url.searchParams);
      if (seg.length === 1 && m === "DELETE") {
        const fromQuery = url.searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
        const fromBody = ((await body()).ids as string[] | undefined) ?? [];
        return deleteSalesOrders([...fromQuery, ...fromBody]);
      }
      if (seg[1] === "delete-precheck" && m === "GET") return json({ deletable: true, blocked: [] });
      if (seg.length === 2 && m === "GET") return getSalesOrder(seg[1]);
      if (seg.length === 2 && m === "PATCH") return patchSalesOrder(seg[1], await body());
    }
    if (seg[0] === "so-size") {
      if (seg[1] === "sales-order" && seg[2] && m === "GET") return listSizes(seg[2]);
      if (seg.length === 1 && m === "POST") return createSize(await body());
      if (seg.length === 2 && m === "DELETE") return deleteSize(seg[1]);
    }
    if (seg[0] === "comments") {
      if (seg.length === 1 && m === "GET") return listComments(url.searchParams);
      if (seg.length === 1 && m === "POST") return createComment(await body());
      if (seg.length === 2 && m === "PATCH") return patchComment(seg[1], await body());
      if (seg.length === 2 && m === "DELETE") return deleteComment(seg[1]);
    }
    if (seg[0] === "comment-threads" && seg.length === 3 && m === "PATCH") {
      if (seg[2] === "resolve") return setThreadResolved(seg[1], true);
      if (seg[2] === "reopen") return setThreadResolved(seg[1], false);
    }
    return fail(`no route: ${m} ${path}`, 404);
  } catch (e) {
    return fail((e as Error).message, 500);
  }
});
