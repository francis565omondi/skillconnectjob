require('dotenv').config({ path: '.env.local' });

console.log('Testing AI Service...');

// Check environment variables
console.log('\n🔍 Environment Variables:');
console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? 'Present' : 'Missing');

// Test basic AI functionality
async function testAIService() {
  try {
    console.log('\n🔍 Testing AI Service functionality...');
    
    // Import the AI service with proper path
    let AIServices;
    try {
      AIServices = require('./lib/aiServices').AIServices;
    } catch (importError) {
      console.error('❌ Error importing AI services:', importError.message);
      console.log('💡 Make sure the file exists at: ./lib/aiServices.ts');
      return;
    }
    
    // Test content moderation
    console.log('Testing content moderation...');
    const moderationResult = await AIServices.moderateContent(
      'This is a professional job posting for a software developer position.',
      'job'
    );
    
    console.log('✅ Content moderation result:', {
      isAppropriate: moderationResult.isAppropriate,
      confidence: moderationResult.confidence,
      flags: moderationResult.flags,
      riskLevel: moderationResult.riskLevel
    });
    
    // Test malicious activity detection
    console.log('\nTesting malicious activity detection...');
    const maliciousResult = await AIServices.detectMaliciousActivity({
      email: 'test@example.com',
      profile: 'John Doe - Software Developer',
      applications: ['Professional application'],
      behavior: {
        loginFrequency: 1,
        applicationRate: 2,
        profileCompleteness: 80,
        lastActivity: new Date().toISOString()
      }
    });
    
    console.log('✅ Malicious activity detection result:', {
      isMalicious: maliciousResult.isMalicious,
      confidence: maliciousResult.confidence,
      riskScore: maliciousResult.riskScore,
      activityType: maliciousResult.activityType
    });
    
    console.log('\n✅ AI Service is working correctly!');
    
  } catch (error) {
    console.error('❌ AI Service test failed:', error.message);
    
    if (error.message.includes('HUGGINGFACE_API_KEY')) {
      console.log('\n💡 Solution: Add HUGGINGFACE_API_KEY to your .env.local file');
      console.log('Get your API key from: https://huggingface.co/settings/tokens');
    } else if (error.message.includes('zero-shot')) {
      console.log('\n💡 Solution: The AI model is working, but there might be a network issue');
    } else {
      console.log('\n💡 The AI service will use fallback methods when unavailable');
    }
  }
}

testAIService(); 