-- Insert sample nodes
INSERT INTO nodes (id, title, x, y, color, icon, parent_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'University Applications', 400, 200, '#3B82F6', '🎓', NULL),
  ('550e8400-e29b-41d4-a716-446655440002', 'Personal Statement', 200, 350, '#10B981', '📝', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440003', 'College Research', 600, 350, '#F59E0B', '🔍', '550e8400-e29b-41d4-a716-446655440001'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Side Projects', 400, 500, '#8B5CF6', '💡', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (node_id, title, completed, priority) VALUES
  -- University Applications tasks
  ('550e8400-e29b-41d4-a716-446655440001', 'Research colleges', true, 'high'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Write personal statement', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Get recommendation letters', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Submit applications', false, 'high'),
  
  -- Personal Statement tasks
  ('550e8400-e29b-41d4-a716-446655440002', 'Brainstorm topics', true, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Write first draft', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Get feedback', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Final revision', false, 'high'),
  
  -- College Research tasks
  ('550e8400-e29b-41d4-a716-446655440003', 'Create comparison spreadsheet', true, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Visit campus websites', false, 'low'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Schedule virtual tours', false, 'medium'),
  
  -- Side Projects tasks
  ('550e8400-e29b-41d4-a716-446655440004', 'Build portfolio website', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Learn React Native', false, 'low');
