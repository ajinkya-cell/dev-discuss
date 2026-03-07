CREATE INDEX problems_search_idx
ON problems
USING GIN (
  to_tsvector('english', title || ' ' || description)
);