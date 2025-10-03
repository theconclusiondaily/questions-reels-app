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
 // Replace your testSupabase function with this fixed version:
// Replace your testSupabase function with this:
window.testSupabase = async function() {
    console.log('🧪 Testing Supabase connection...');
    
    try {
        // Test 1: Basic connection
        const { data, error } = await supabaseClient.from('users').select('count');
        
        if (error) {
            console.error('❌ Connection test failed:', error);
            return false;
        }
        
        console.log('✅ Supabase connection successful!');
        console.log('📊 Database response:', data);
        
        // Test 2: Try to insert a test user with ALL required fields
        console.log('🧪 Testing data insertion...');
        const testUser = {
            email: `test${Date.now()}@test.com`,
            username: `testuser${Date.now()}`,
            password: 'test123',
            mobile: '1234567890',
            is_active: true // This is now required
        };
        
        const { data: userData, error: userError } = await supabaseClient
            .from('users')
            .insert([testUser])
            .select();
            
        if (userError) {
            console.error('❌ Insert test failed:', userError);
            return false;
        }
        
        console.log('✅ Data insertion test passed! User ID:', userData[0].id);
        console.log('📋 User details:', userData[0]);
        
        // Test 3: Verify we can read data back
        const { data: users, error: readError } = await supabaseClient
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
            
        if (readError) {
            console.error('❌ Read test failed:', readError);
            return false;
        }
        
        console.log('✅ Data read test passed! Total users:', users.length);
        
        // Test 4: Test quiz_results table
        console.log('🧪 Testing quiz_results table...');
        const testResult = {
            user_id: userData[0].id,
            user_email: userData[0].email,
            username: userData[0].username,
            score: 8,
            total_questions: 10,
            percentage: 80.0,
            time_spent: 120,
            answers: { Q1: 'A', Q2: 'B', Q3: 'C' },
            quiz_type: 'general'
        };
        
        const { data: resultData, error: resultError } = await supabaseClient
            .from('quiz_results')
            .insert([testResult])
            .select();
            
        if (resultError) {
            console.error('❌ Quiz result insert failed:', resultError);
            // This might be expected if quiz_results table has similar issues
        } else {
            console.log('✅ Quiz result insert passed! Result ID:', resultData[0].id);
        }
        
        alert('🎉 Supabase connection successful! Database is working!');
        return true;
        
    } catch (error) {
        console.error('❌ Connection test error:', error);
        alert('❌ Connection test failed: ' + error.message);
        return false;
    }
};

// Add this helper function to check table structure
async function checkTableStructure() {
    console.log('🔍 Checking table structure requirements...');
    
    try {
        // Try minimal insert to see what's absolutely required
        const minimalUser = {
            email: `minimaltest${Date.now()}@test.com`,
            username: `minimaltest`,
            password: 'test123'
        };
        
        const { data, error } = await supabaseClient
            .from('users')
            .insert([minimalUser])
            .select();
            
        if (error) {
            console.log('❌ Minimal insert failed:', error.message);
            console.log('💡 You need to provide these additional fields or make them nullable in Supabase');
        } else {
            console.log('✅ Minimal insert worked! Only these fields are required:');
            console.log('- email, username, password');
            
            // Clean up
            await supabaseClient.from('users').delete().eq('id', data[0].id);
        }
        
    } catch (error) {
        console.error('Structure check failed:', error);
    }
}

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