/*
  # Sample Data Migration

  1. Sample Categories
    - Insert default categories with colors and usage counts
    - Uses ON CONFLICT to avoid duplicate key errors

  2. Sample Tasks
    - Insert diverse sample tasks across different categories
    - Include AI-enhanced and context-based examples
    - Various priority levels and statuses

  3. Sample Context Entries
    - Insert sample context from different sources (WhatsApp, email, notes)
    - Include processed insights, keywords, and sentiment analysis
    - Demonstrate AI analysis capabilities
*/

-- Insert sample categories (avoid duplicates)
INSERT INTO categories (name, color, usage_count) VALUES
('Work', '#3B82F6', 5),
('Personal', '#10B981', 3),
('Health', '#EF4444', 2),
('Education', '#8B5CF6', 4),
('Finance', '#F59E0B', 1),
('Shopping', '#EC4899', 2)
ON CONFLICT (name) DO NOTHING;

-- Insert sample tasks (use unique titles to avoid conflicts)
INSERT INTO tasks (title, description, category, priority_score, deadline, status, ai_enhanced, context_based) VALUES
('Complete Q1 project presentation', 'Prepare slides for quarterly review meeting with stakeholders. Include Q3 performance metrics and Q4 projections.', 'Work', 5, '2025-01-10', 'pending', true, true),
('Annual doctor appointment', 'Annual health checkup with Dr. Smith. Remember to bring insurance card and list of current medications.', 'Health', 3, '2025-01-15', 'pending', false, false),
('Weekly grocery shopping', 'Weekly grocery shopping - milk, bread, eggs, vegetables, fruits. Check pantry before leaving.', 'Personal', 2, '2025-01-08', 'pending', false, false),
('Submit 2024 tax documents', 'Gather all 2024 tax documents and submit to accountant. Include W2, 1099s, and expense receipts.', 'Finance', 4, '2025-01-20', 'pending', true, false),
('Master React hooks course', 'Complete online course on advanced React hooks. Focus on useCallback, useMemo, and custom hooks.', 'Education', 3, '2025-01-25', 'in_progress', true, true),
('Weekly team standup prep', 'Prepare agenda for weekly team standup. Review sprint progress and blockers.', 'Work', 4, '2025-01-09', 'completed', false, true),
('Upper body gym session', 'Upper body strength training session. Focus on chest, shoulders, and triceps.', 'Health', 2, '2025-01-07', 'completed', false, false),
('Summer vacation flight booking', 'Research and book flights for summer vacation to Europe. Compare prices across airlines.', 'Personal', 3, '2025-02-01', 'pending', false, false),
('Client proposal review', 'Review and finalize the client proposal for the new mobile app project. Include timeline and budget estimates.', 'Work', 5, '2025-01-12', 'in_progress', true, true),
('Morning meditation practice', 'Daily 20-minute meditation session to improve focus and reduce stress levels.', 'Health', 2, '2025-01-08', 'pending', false, false);

-- Insert sample context entries
INSERT INTO context_entries (content, source_type, processed_insights, keywords, sentiment) VALUES
('Hey, don''t forget about the client meeting tomorrow at 2 PM. We need to discuss the new project requirements and timeline.', 'whatsapp', 'Important meeting reminder with time-sensitive nature. Requires preparation for client discussion.', ARRAY['meeting', 'client', 'project', 'requirements', 'timeline'], 'neutral'),

('Subject: Quarterly Review Presentation
Hi Team,
Please prepare your quarterly review presentations for next week''s board meeting. Include performance metrics, achievements, and next quarter goals.
Best regards,
Sarah', 'email', 'Work-related task with deadline pressure. Requires comprehensive preparation and data compilation.', ARRAY['quarterly', 'presentation', 'board', 'meeting', 'performance', 'metrics'], 'neutral'),

('Reminder: Doctor appointment scheduled for next Tuesday at 10 AM. Please arrive 15 minutes early for check-in.', 'notes', 'Healthcare appointment with specific timing requirements. Personal health management task.', ARRAY['doctor', 'appointment', 'health', 'checkup'], 'neutral'),

('Great news! The project got approved and we can start implementation next month. The client is very excited about the features we proposed.', 'whatsapp', 'Positive project update indicating success and forward momentum. Celebration-worthy achievement.', ARRAY['project', 'approved', 'implementation', 'client', 'features'], 'positive'),

('Subject: Urgent: Tax deadline approaching
Dear Client,
This is a reminder that the tax filing deadline is approaching. Please submit all required documents by January 20th to avoid penalties.
Tax Advisory Services', 'email', 'Time-sensitive financial obligation with legal implications. Requires immediate attention and document preparation.', ARRAY['tax', 'deadline', 'documents', 'penalties', 'urgent'], 'negative'),

('Just finished an amazing workout at the gym! Feeling energized and ready to tackle the rest of the day. Consistency is key!', 'notes', 'Personal achievement and motivation. Positive health and wellness activity completion.', ARRAY['workout', 'gym', 'energized', 'consistency', 'health'], 'positive'),

('The team meeting went really well today. We discussed the new features and everyone is on board. Looking forward to the implementation phase.', 'notes', 'Successful team collaboration and project progress. Positive team dynamics and clear direction.', ARRAY['team', 'meeting', 'features', 'implementation', 'collaboration'], 'positive'),

('Subject: Budget Approval Required
Hi,
The marketing budget for Q2 needs your approval. Please review the attached spreadsheet and let me know if you have any questions.
Thanks,
Marketing Team', 'email', 'Financial decision-making task requiring review and approval. Business-critical budget planning.', ARRAY['budget', 'approval', 'marketing', 'spreadsheet', 'review'], 'neutral'),

('Can we reschedule tomorrow''s lunch? Something urgent came up at work and I need to handle it immediately.', 'whatsapp', 'Schedule conflict requiring immediate attention. Work priorities taking precedence over personal plans.', ARRAY['reschedule', 'lunch', 'urgent', 'work', 'immediately'], 'negative'),

('Completed my morning run! 5km in 28 minutes. Weather was perfect and feeling great. Ready to start the day productively.', 'notes', 'Personal fitness achievement with positive energy. Healthy lifestyle maintenance and goal accomplishment.', ARRAY['morning', 'run', 'fitness', 'weather', 'productive'], 'positive');