# comment-test

화면의 특정 셀을 클릭해서 댓글을 남기는 기능을 각자 자기 앱에서 구현해 보고 비교하는 프로젝트입니다.
댓글 저장소는 Supabase 프로젝트 하나를 같이 씁니다. 프론트 코드는 공유하지 않고, 저장 규칙과 엣지케이스에 대한 선택만 맞춥니다.

## 문제: 댓글을 "어디에" 붙일 것인가

처음 떠오르는 방법은 HTML 요소에 id를 붙이고 그 id로 댓글을 저장하는 것입니다. 그런데 id를 위치로 만들면(`row-3-col-5`) 정렬이나 검색으로 행 순서가 바뀌는 순간 댓글이 다른 데이터 위에 뜹니다.

그래서 이 프로젝트에서는 댓글을 **화면 요소가 아니라 데이터에** 붙입니다. 댓글 하나를 저장할 때 다음 세 가지를 함께 저장합니다.

| 저장하는 것 | 예시 | 설명 |
|---|---|---|
| 어느 테이블인가 (`target_type`) | `GEULIM_SALES_ORDER` | 앱 이름을 앞에 붙여서 앱끼리 겹치지 않게 합니다 |
| 어느 행인가 (`target_id`) | `018f3c…` | 그 행의 PK. 앱마다 uuid나 숫자일 수 있어 문자열로 저장합니다 |
| 어느 열인가 (`field_path`) | `buyerPo` | API 응답에서 그 열의 키 이름. 비워두면 행 전체에 대한 댓글입니다 |
| (선택) 부모 행 (`context_id`) | 수주 id | 사이즈처럼 부모에 딸린 행에 댓글을 달 때 부모 PK 를 같이 저장합니다. 행이 삭제된 뒤에도 부모 기준으로 댓글을 찾을 수 있습니다 (엣지케이스 1-B 용) |

렌더링할 때 각 셀은 자기 데이터로 이 세 값을 만들고, 댓글 목록에서 자기 것을 찾아 표시합니다. 셀이 어디로 이동하든 데이터가 키를 들고 다니기 때문에 댓글이 따라옵니다.

## 엣지케이스와 선택지

팀마다 다르게 가져갈 수 있는 부분입니다. 각자 고르고 아래 표에 기록해 주세요.

```
필수 조건
  정렬·검색으로 위치가 바뀌어도 댓글은 원래 달았던 데이터를 따라가야 한다.

1. 행이 동적으로 추가·삭제되는 테이블 (사이즈, 선적 항차 등)
   A 행이 삭제되면 댓글도 안 보임
   B 삭제된 행의 댓글도 따로 볼 수 있게
   C 지원하지 않음

2. 합계·건수 등 조회 조건에 따라 바뀌는 값
   A 댓글 당시 값·조회 조건을 스냅샷으로 남겨서 보여줌
   B 변경됨 표시만
   C 지원하지 않음

3. 같은 데이터가 여러 화면에 나오는 경우
   A 어느 화면이든 같이 보임
   B 화면별로 따로

4. 댓글 단 뒤 값이 바뀐 경우
   A 댓글 당시 값을 스냅샷으로 보여줌 + 변경됨 표시
   B 변경됨 표시만
   C 아무것도 안 함
```

### 선택 기록

| 팀/앱 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| geulim | B (안 되면 C) | A | B | A |
| | | | | |

### geulim 구현 메모

- 화면별 분리(3-B)는 `target_type` 에 화면을 넣어서 합니다: `GEULIM_SALES_ORDER_LIST` / `GEULIM_SALES_ORDER_DETAIL`. 같은 수주 id 라도 목록 댓글은 상세에 안 보입니다.
- 집계 카드(2-A)는 DB 행이 없어 `target_type=GEULIM_SALES_ORDER_LIST_SUMMARY`, `target_id=sales-order-list`(화면 고정값), `field_path=totalCount` 처럼 붙이고, `value_snapshot` 에 `"67 건 (진행 · brandName=nike)"` 처럼 값과 조회 조건을 같이 남깁니다.
- 사이즈 행(1-B)은 `context_id` 에 수주 id 를 넣고, 상세 화면은 `contextId` 로 조회해 지금 목록에 없는 행의 스레드를 "삭제된 행의 댓글" 로 보여줍니다.
- 값 변경(4-A)은 댓글마다 `value_snapshot`(작성 당시 표시값) 을 저장하고, 현재 값과 다르면 "변경됨" + 옛 값을 보여줍니다. 빈 값도 `""` 로 저장해 나중에 채워지면 변경으로 잡힙니다.
- 프론트: `web/src/widgets/commentable` — `CommentScope`(화면의 행 id 들로 스레드 일괄 조회) + `Commentable`(셀·필드 래퍼, 말풍선) + `CommentPanel`(우측 패널). 셀 식별은 `data-comment-target/id/field` 속성이지만 저장·조회는 전부 데이터 키로만 합니다.

## 세팅

1. Supabase 프로젝트는 이미 만들어져 있습니다 (`comment-test`). 스키마·시드·API 전부 적용된 상태입니다.
2. 각자 앱 `.env` 에 아래 두 값을 넣습니다 (`.env.example` 참고). publishable key 는 대시보드 Project Settings → API Keys.

```
COMMENT_API_URL=https://nvzifhpnirvhxbemmhlx.supabase.co/functions/v1/api
COMMENT_API_KEY=<publishable key>
```

3. 모든 요청에 헤더 `apikey: <publishable key>` 를 붙입니다. 인증·조직 헤더는 없습니다.

다시 세팅해야 할 때 (파일은 전부 이 저장소에 있습니다):

```
psql <connection string> -f schema.sql          # 댓글 테이블
psql <connection string> -f schema.order.sql    # 시연용 수주 테이블
psql <connection string> -f seed.order.sql      # 수주 30건 + 사이즈 행 (다시 돌리면 초기화)
supabase functions deploy api --remote=<project ref> --no-verify-jwt --yes
```

## API

Edge Function 하나(`supabase/functions/api/index.ts`)가 geulim 백엔드와 같은 모양의 REST 를 제공합니다. 응답 키는 camelCase 입니다.

### 댓글 (전원 공통)

```
GET    /comments?targetType=GEULIM_SALES_ORDER&targetIds=a,b,c[&fieldPath=buyerPo]
       → [{ id, targetType, targetId, fieldPath, contextId, resolvedAt, comments: [{ id, authorId, authorName, body, valueSnapshot, createdAt }] }]
GET    /comments?targetType=GEULIM_SO_SIZE&contextId=<부모 id>
       → 부모 기준 전체. 지금은 없는(삭제된) 자식 행의 스레드도 같이 옵니다
POST   /comments        { targetType, targetId, fieldPath, contextId?, authorId, authorName, body, valueSnapshot }
       → { thread, comment }   (같은 셀에 스레드가 이미 있으면 재사용)
PATCH  /comment-threads/:id/reopen
PATCH  /comments/:id    { body }
DELETE /comments/:id    (soft delete)
PATCH  /comment-threads/:id/resolve
PATCH  /comment-threads/:id/reopen
```

### 시연용 수주 (geulim 이 쓰는 것. 다른 앱은 자기 데이터로)

```
GET    /sales-orders?search=&status=DRAFT,COMPLETED&sort=orderQty&order=desc&page=1&take=20
       → { salesOrders: [...], currentPage, totalCount, totalPage,
           totalOrderQuantity, totalProdQuantity, totalOrderAmount, totalProdAmount, totalBuyerQuantity, draftCount }
       합계는 검색 조건에 걸린 전체 기준이라 조건을 바꾸면 값이 바뀝니다 (엣지케이스 2번).
GET    /sales-orders/:id              → 수주 + sizes[]
PATCH  /sales-orders/:id              { 바꿀 필드 }
DELETE /sales-orders?ids=a,b
GET    /sales-orders/delete-precheck  → { deletable: true, blocked: [] }
GET    /so-size/sales-order/:salesOrderId
POST   /so-size                       { salesOrderId, sizeName, isBasic? }
DELETE /so-size/:id
```

예시:

```bash
curl -H "apikey: $COMMENT_API_KEY" "$COMMENT_API_URL/sales-orders?take=2"
curl -H "apikey: $COMMENT_API_KEY" -H "Content-Type: application/json" -X POST "$COMMENT_API_URL/comments" \
  -d '{"targetType":"GEULIM_SALES_ORDER","targetId":"<수주 id>","fieldPath":"remark","authorId":"u1","authorName":"지환","body":"확인 필요","valueSnapshot":"현재 값"}'
```

테이블을 직접 보려면 대시보드 Table Editor, 또는 PostgREST `GET /rest/v1/<테이블>` 도 그대로 열려 있습니다.
