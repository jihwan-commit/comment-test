-- comment-test: 시연용 오더(수주) 스키마. geulim_be 의 sales_order / so_size 를 참고해
-- 댓글 시연에 필요한 열만 남기고, 마스터·사용자 테이블은 연결하지 않고 이름을 문자열로 그대로 담는다.

create type sales_order_status as enum ('DRAFT', 'COMPLETED', 'CLOSED');
create type sales_order_type   as enum ('CMT', 'FULL_PACKAGE');

create table if not exists sales_order (
  id                uuid primary key default gen_random_uuid(),
  status            sales_order_status not null default 'DRAFT',

  -- 시즌·소속 (마스터 대신 문자열)
  season            varchar(10)  not null,            -- 'SS' | 'FW'
  year              smallint     not null,            -- 2026
  team_name         varchar(100),
  buyer_name        varchar(100) not null,
  brand_name        varchar(100) not null,

  -- 스타일
  style_number      varchar(100) not null,            -- 본오더 품번
  style_code        varchar(50),
  style_description varchar(255),
  designer          varchar(100),
  gender            varchar(50),
  category          varchar(50),
  remark            varchar(500),

  -- 거래 조건
  currency          varchar(10)  not null default 'USD',
  unit              varchar(10)  not null default 'pcs',
  order_type        sales_order_type,
  order_qty         integer      not null default 0,  -- 확정 오더 수량
  prod_qty          integer      not null default 0,  -- 지시 수량
  order_amount      numeric(18,2) not null default 0,
  prod_amount       numeric(18,2) not null default 0,
  delivery_date     date,

  -- 생산
  sewing_factory_name    varchar(100),
  sewing_factory_country varchar(50),
  sample_type       varchar(20),                      -- 'PP' | '수납' | 'QC'

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists sales_order_status_idx       on sales_order (status);
create index if not exists sales_order_style_number_idx on sales_order (style_number);
create index if not exists sales_order_created_at_idx   on sales_order (created_at desc);

-- 사이즈 행: 상세 수량 탭에서 동적으로 추가·삭제되는 테이블 (엣지케이스 1번)
create table if not exists so_size (
  id             uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references sales_order(id) on delete cascade,
  size_name      varchar(20) not null,                -- 'S' | 'M' | 'L' | '90' …
  is_basic       boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (sales_order_id, size_name)
);
create index if not exists so_size_sales_order_idx on so_size (sales_order_id);

create or replace trigger sales_order_updated_at before update on sales_order for each row execute function set_updated_at();
create or replace trigger so_size_updated_at     before update on so_size     for each row execute function set_updated_at();

alter table sales_order disable row level security;
alter table so_size     disable row level security;
