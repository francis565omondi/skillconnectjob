-- User Activity Monitoring System
-- This script sets up comprehensive user activity tracking for admin monitoring

-- 1. User Sessions Table (for login/logout tracking)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_type TEXT, -- mobile, desktop, tablet
    browser TEXT,
    os TEXT,
    location TEXT, -- city, country
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Activity Log Table (for tracking all user actions)
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- login, logout, job_apply, profile_update, etc.
    activity_details JSONB, -- detailed information about the activity
    page_url TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Admin Actions Table (for tracking admin interventions)
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- suspend, ban, warn, delete, etc.
    reason TEXT,
    duration INTERVAL, -- for temporary actions
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- 4. User Warnings Table (for tracking warnings given to users)
CREATE TABLE IF NOT EXISTS user_warnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    warning_type TEXT NOT NULL, -- spam, inappropriate_content, violation, etc.
    message TEXT NOT NULL,
    severity TEXT DEFAULT 'low', -- low, medium, high, critical
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Suspicious Activity Alerts Table
CREATE TABLE IF NOT EXISTS suspicious_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL, -- multiple_logins, rapid_actions, unusual_pattern, etc.
    severity TEXT DEFAULT 'medium', -- low, medium, high, critical
    details JSONB,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_login_time ON user_sessions(login_time);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);

CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON user_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_actions_is_active ON admin_actions(is_active);

CREATE INDEX IF NOT EXISTS idx_user_warnings_user_id ON user_warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_warnings_severity ON user_warnings(severity);

CREATE INDEX IF NOT EXISTS idx_suspicious_activities_user_id ON suspicious_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_suspicious_activities_alert_type ON suspicious_activities(alert_type);
CREATE INDEX IF NOT EXISTS idx_suspicious_activities_is_resolved ON suspicious_activities(is_resolved);

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspicious_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON user_sessions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can insert their own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_activities
CREATE POLICY "Users can view their own activities" ON user_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities" ON user_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can insert their own activities" ON user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for admin_actions
CREATE POLICY "Admins can view all admin actions" ON admin_actions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert admin actions" ON admin_actions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update admin actions" ON admin_actions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for user_warnings
CREATE POLICY "Users can view their own warnings" ON user_warnings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all warnings" ON user_warnings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert warnings" ON user_warnings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for suspicious_activities
CREATE POLICY "Admins can view all suspicious activities" ON suspicious_activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert suspicious activities" ON suspicious_activities
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update suspicious activities" ON suspicious_activities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create functions for automatic activity tracking
CREATE OR REPLACE FUNCTION log_user_activity(
    p_user_id UUID,
    p_session_id UUID,
    p_activity_type TEXT,
    p_activity_details JSONB DEFAULT NULL,
    p_page_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO user_activities (
        user_id,
        session_id,
        activity_type,
        activity_details,
        page_url,
        ip_address,
        user_agent
    ) VALUES (
        p_user_id,
        p_session_id,
        p_activity_type,
        p_activity_details,
        p_page_url,
        inet_client_addr(),
        current_setting('request.headers')::json->>'user-agent'
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create new session
CREATE OR REPLACE FUNCTION create_user_session(
    p_user_id UUID,
    p_session_token TEXT
)
RETURNS UUID AS $$
DECLARE
    session_id UUID;
    user_agent_json JSONB;
    device_info JSONB;
BEGIN
    -- Parse user agent for device info
    user_agent_json := current_setting('request.headers')::json->>'user-agent';
    
    -- Simple device detection (you can enhance this)
    device_info := CASE 
        WHEN user_agent_json LIKE '%Mobile%' THEN '{"device_type": "mobile"}'
        WHEN user_agent_json LIKE '%Tablet%' THEN '{"device_type": "tablet"}'
        ELSE '{"device_type": "desktop"}'
    END::jsonb;
    
    INSERT INTO user_sessions (
        user_id,
        session_token,
        ip_address,
        user_agent,
        device_type,
        browser,
        os
    ) VALUES (
        p_user_id,
        p_session_token,
        inet_client_addr(),
        user_agent_json,
        device_info->>'device_type',
        'Unknown', -- You can enhance this with proper browser detection
        'Unknown'  -- You can enhance this with proper OS detection
    ) RETURNING id INTO session_id;
    
    -- Log the login activity
    PERFORM log_user_activity(p_user_id, session_id, 'login', '{"session_id": "' || session_id || '"}');
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end session
CREATE OR REPLACE FUNCTION end_user_session(
    p_session_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    session_record RECORD;
BEGIN
    SELECT * INTO session_record FROM user_sessions WHERE id = p_session_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update session
    UPDATE user_sessions 
    SET logout_time = NOW(), is_active = false, updated_at = NOW()
    WHERE id = p_session_id;
    
    -- Log the logout activity
    PERFORM log_user_activity(
        session_record.user_id, 
        p_session_id, 
        'logout', 
        '{"session_id": "' || p_session_id || '", "duration": "' || 
        EXTRACT(EPOCH FROM (NOW() - session_record.login_time)) || ' seconds"}'
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check for suspicious activities
CREATE OR REPLACE FUNCTION check_suspicious_activity(
    p_user_id UUID
)
RETURNS VOID AS $$
DECLARE
    recent_logins INTEGER;
    rapid_actions INTEGER;
BEGIN
    -- Check for multiple logins in short time
    SELECT COUNT(*) INTO recent_logins
    FROM user_sessions 
    WHERE user_id = p_user_id 
    AND login_time > NOW() - INTERVAL '1 hour';
    
    IF recent_logins > 5 THEN
        INSERT INTO suspicious_activities (user_id, alert_type, severity, details)
        VALUES (p_user_id, 'multiple_logins', 'high', 
                jsonb_build_object('login_count', recent_logins, 'timeframe', '1 hour'));
    END IF;
    
    -- Check for rapid actions
    SELECT COUNT(*) INTO rapid_actions
    FROM user_activities 
    WHERE user_id = p_user_id 
    AND created_at > NOW() - INTERVAL '5 minutes';
    
    IF rapid_actions > 50 THEN
        INSERT INTO suspicious_activities (user_id, alert_type, severity, details)
        VALUES (p_user_id, 'rapid_actions', 'medium', 
                jsonb_build_object('action_count', rapid_actions, 'timeframe', '5 minutes'));
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM user_sessions WHERE is_active = true) as active_sessions,
    (SELECT COUNT(*) FROM user_sessions WHERE login_time > NOW() - INTERVAL '24 hours') as logins_24h,
    (SELECT COUNT(*) FROM user_activities WHERE created_at > NOW() - INTERVAL '24 hours') as activities_24h,
    (SELECT COUNT(*) FROM suspicious_activities WHERE is_resolved = false) as pending_alerts,
    (SELECT COUNT(*) FROM user_warnings WHERE created_at > NOW() - INTERVAL '24 hours') as warnings_24h;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Insert sample data for testing (optional)
-- INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent) VALUES 
-- ('sample-user-id', 'sample-token', '127.0.0.1', 'Mozilla/5.0...'); 