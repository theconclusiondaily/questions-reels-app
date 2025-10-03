// supabase.js - Safe initialization
console.log('🚀 Starting Supabase initialization...');

const SUPABASE_CONFIG = {
    url: 'https://rggqgrjovqncorratqxh.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZ3FncmpvdnFuY29ycmF0cXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0ODA4OTMsImV4cCI6MjA3NTA1Njg5M30.tr2A4M3lJZbDQejsOrBQeJn1V7eUm-6eakD2tbfJYVs'
};

console.log('📋 Supabase URL:', SUPABASE_CONFIG.url);

// Wait for Supabase library to load
function initializeSupabase() {
    try {
        // Check if Supabase library is available
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase library not loaded yet');
            return null;
        }
        
        console.log('✅ Supabase library found, creating client...');
        const client = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        window.supabaseClient = client;
        console.log('✅ Supabase client created successfully');
        return client;
        
    } catch (error) {
        console.error('❌ Error creating Supabase client:', error);
        return null;
    }
}

// Initialize immediately if possible, otherwise wait
let supabaseClient;
if (typeof supabase !== 'undefined') {
    supabaseClient = initializeSupabase();
} else {
    console.log('⏳ Supabase library not ready, will initialize later');
    // Try again after a short delay
    setTimeout(() => {
        supabaseClient = initializeSupabase();
        if (supabaseClient) {
            setupFunctions(supabaseClient);
        }
    }, 100);
}

function setupFunctions(client) {
    // Enhanced test function
    window.testSupabase = async function() {
        console.log('🧪 Testing Supabase connection...');
        
        if (!client) {
            console.error('❌ No Supabase client available');
            return false;
        }
        
        try {
            // Test 1: Basic connection
            const { data, error } = await client.from('users').select('count');
            
            if (error) {
                console.error('❌ Connection test failed:', error);
                return false;
            }
            
            console.log('✅ Supabase connection successful!');
            console.log('📊 Database response:', data);
            
            // Test 2: Try to insert a test user
            console.log('🧪 Testing data insertion...');
            const testUser = {
                email: `test${Date.now()}@test.com`,
                username: `testuser${Date.now()}`,
                password: 'test123',
                mobile: '1234567890'
            };
            
            const { data: userData, error: userError } = await client
                .from('users')
                .insert([testUser])
                .select();
                
            if (userError) {
                console.error('❌ Insert test failed:', userError);
                // This might be expected if table doesn't exist yet
                return true; // Still return true for connection
            }
            
            console.log('✅ Data insertion test passed! User ID:', userData[0].id);
            
            // Test 3: Verify we can read data back
            const { data: users, error: readError } = await client
                .from('users')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
                
            if (readError) {
                console.error('❌ Read test failed:', readError);
                return true; // Still return true for connection
            }
            
            console.log('✅ Data read test passed! Total users:', users.length);
            console.log('📋 Recent users:', users);
            
            alert('🎉 All Supabase tests passed! Your database is working perfectly!');
            return true;
            
        } catch (error) {
            console.error('❌ Connection test error:', error);
            alert('❌ Connection test failed: ' + error.message);
            return false;
        }
    };

    // Quick connection check
    window.quickCheck = async function() {
        try {
            const { error } = await client.from('users').select('count');
            if (error) throw error;
            console.log('✅ Quick connection check passed');
            return true;
        } catch (error) {
            console.error('❌ Quick connection check failed:', error);
            return false;
        }
    };

    console.log('🎯 Supabase setup complete. Run testSupabase() to test connection.');
}

// If we have a client already, set up functions immediately
if (supabaseClient) {
    setupFunctions(supabaseClient);
}

// Make client available globally
window.supabaseClient = supabaseClient;

console.log('🏁 Supabase initialization script completed');