-- Insert sample mindmaps
INSERT INTO mindmaps (id, title, description, color, icon) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'University Applications', 'Planning and tracking my university application process', '#3B82F6', '🎓'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Personal Projects', 'Side projects and learning goals', '#8B5CF6', '💡'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Work Tasks', 'Professional responsibilities and deadlines', '#10B981', '💼')
ON CONFLICT (id) DO NOTHING;

-- Insert sample nodes for University Applications
INSERT INTO nodes (id, mindmap_id, title, x, y, color, icon, parent_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'University Applications', 400, 200, '#3B82F6', '🎓', NULL),
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Personal Statement', 200, 350, '#10B981', '📝', '550e8400-e29b-41d4-a716-446655440011'),
  ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'College Research', 600, 350, '#F59E0B', '🔍', '550e8400-e29b-41d4-a716-446655440011')
ON CONFLICT (id) DO NOTHING;

-- Insert sample nodes for Personal Projects
INSERT INTO nodes (id, mindmap_id, title, x, y, color, icon, parent_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Portfolio Website', 400, 200, '#8B5CF6', '🌐', NULL),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 'Frontend Development', 250, 350, '#06B6D4', '⚛️', '550e8400-e29b-41d4-a716-446655440021'),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 'Backend API', 550, 350, '#84CC16', '🔧', '550e8400-e29b-41d4-a716-446655440021'),
  ('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440002', 'Mobile App', 400, 500, '#F97316', '📱', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample nodes for Work Tasks
INSERT INTO nodes (id, mindmap_id, title, x, y, color, icon, parent_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440003', 'Q1 Goals', 400, 200, '#10B981', '🎯', NULL),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440003', 'Team Management', 250, 350, '#EF4444', '👥', '550e8400-e29b-41d4-a716-446655440031'),
  ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440003', 'Product Launch', 550, 350, '#F59E0B', '🚀', '550e8400-e29b-41d4-a716-446655440031')
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (node_id, title, completed, priority) VALUES
  -- University Applications tasks
  ('550e8400-e29b-41d4-a716-446655440011', 'Research colleges', true, 'high'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Write personal statement', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Get recommendation letters', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440011', 'Submit applications', false, 'high'),
  
  -- Personal Statement tasks
  ('550e8400-e29b-41d4-a716-446655440012', 'Brainstorm topics', true, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Write first draft', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Get feedback', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440012', 'Final revision', false, 'high'),
  
  -- College Research tasks
  ('550e8400-e29b-41d4-a716-446655440013', 'Create comparison spreadsheet', true, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440013', 'Visit campus websites', false, 'low'),
  ('550e8400-e29b-41d4-a716-446655440013', 'Schedule virtual tours', false, 'medium'),
  
  -- Personal Projects tasks
  ('550e8400-e29b-41d4-a716-446655440021', 'Choose tech stack', true, 'high'),
  ('550e8400-e29b-41d4-a716-446655440021', 'Design wireframes', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440022', 'Set up React project', true, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440022', 'Implement responsive design', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440022', 'Add animations', false, 'low'),
  ('550e8400-e29b-41d4-a716-446655440023', 'Design database schema', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440023', 'Implement REST API', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440024', 'Learn React Native', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440024', 'Build MVP', false, 'low'),
  
  -- Work Tasks
  ('550e8400-e29b-41d4-a716-446655440031', 'Set quarterly objectives', true, 'high'),
  ('550e8400-e29b-41d4-a716-446655440031', 'Review team performance', false, 'medium'),
  ('550e8400-e29b-41d4-a716-446655440032', 'Schedule 1-on-1s', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440032', 'Plan team building', false, 'low'),
  ('550e8400-e29b-41d4-a716-446655440033', 'Finalize product features', false, 'high'),
  ('550e8400-e29b-41d4-a716-446655440033', 'Coordinate marketing', false, 'medium');
