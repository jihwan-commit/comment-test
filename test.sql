-- 1. 오더
select * from sales_order where status = 'COMPLETED' order by created_at desc limit 20;
--    → id 20개 손에 쥠

-- 2. 그 20개의 댓글 요약 (전체가 아니라 in 으로 좁힘)
select target_id, field_path, count(*) 
from comment_thread t join comment c on c.thread_id = t.id
where t.target_type = 'GEULIM_SALES_ORDER_LIST'
  and t.target_id in ('id1', 'id2', …, 'id20')   -- ← 1번 결과
group by target_id, field_path;
