-- comment-test: 시연용 시드. 수주 120건 + 사이즈 행. 다시 돌리면 전부 지우고 새로 넣는다.
truncate so_size, sales_order cascade;

with
  buyers  as (select unnest(array['NIKE','ZARA','UNIQLO','H&M','GAP']) as name, generate_series(1,5) as i),
  brands  as (select unnest(array['Nike Sportswear','Zara Basic','Uniqlo U','H&M Divided','GAP Kids']) as name, generate_series(1,5) as i),
  teams   as (select unnest(array['1팀','2팀','3팀']) as name, generate_series(1,3) as i),
  fact    as (select unnest(array['동대문봉제','하노이공장','다카공장','청도공장']) as name,
                     unnest(array['KR','VN','BD','CN']) as country, generate_series(1,4) as i),
  rows_   as (select generate_series(1,120) as n)
insert into sales_order (
  status, season, year, team_name, buyer_name, brand_name,
  style_number, style_code, style_description, designer, gender, category,
  currency, unit, order_type, order_qty, prod_qty, order_amount, prod_amount, delivery_date,
  sewing_factory_name, sewing_factory_country, sample_type, created_at
)
select
  -- 상태는 바이어(5주기)와 겹치지 않게 7주기로 섞는다
  (array['DRAFT','COMPLETED','COMPLETED','COMPLETED','CLOSED','COMPLETED','DRAFT'])[((n-1) % 7) + 1]::sales_order_status,
  case when n % 2 = 0 then 'SS' else 'FW' end,
  2025 + (n % 2),
  t.name,
  b.name,
  br.name,
  format('MNL-%s-%s%s', (array['KTR','AXL','BRV','KDO'])[((n-1) % 4) + 1], 25 + (n % 2), lpad(n::text, 3, '0')),
  lpad((n + 13)::text, 3, '0'),
  (array['크루넥 반팔 티셔츠','후드 집업','데님 와이드 팬츠','다운 패딩','린넨 셔츠','조거 팬츠'])[((n-1) % 6) + 1],
  (array['김지환','이수민','박서연'])[((n-1) % 3) + 1],
  (array['남성','여성','공용'])[((n-1) % 3) + 1],
  (array['상의','하의','아우터'])[((n-1) % 3) + 1],
  'USD', 'pcs',
  (array['CMT','FULL_PACKAGE'])[((n-1) % 2) + 1]::sales_order_type,
  1000 + (n % 12) * 1500,
  1000 + (n % 12) * 1500 - (n % 4) * 100,
  (1000 + (n % 12) * 1500) * (12 + (n % 7)),
  (1000 + (n % 12) * 1500 - (n % 4) * 100) * (12 + (n % 7)),
  case when n % 5 = 0 then null else date '2026-01-01' + (n * 7) end,
  case when n % 7 = 2 then null else f.name end,
  case when n % 7 = 2 then null else f.country end,
  (array['PP','수납','QC'])[((n-1) % 3) + 1],
  now() - (n || ' days')::interval
from rows_ r
join buyers b  on b.i  = ((n-1) % 5) + 1
join brands br on br.i = ((n-1) % 5) + 1
join teams t   on t.i  = ((n-1) % 3) + 1
join fact f    on f.i  = ((n-1) % 4) + 1;

-- 사이즈: 수주마다 S·M·L (M 기본). 3건 중 1건은 XL 추가
insert into so_size (sales_order_id, size_name, is_basic, sort_order)
select so.id, s.name, s.name = 'M', s.ord
from sales_order so
cross join (values ('S',1),('M',2),('L',3)) as s(name, ord);

insert into so_size (sales_order_id, size_name, is_basic, sort_order)
select id, 'XL', false, 4 from sales_order where style_code::int % 3 = 0;

select count(*) as sales_orders from sales_order;
select count(*) as so_sizes from so_size;
