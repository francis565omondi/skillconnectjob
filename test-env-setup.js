// Test environment variables setup
require('dotenv').config({ path: '.env.local' })

console.log('🔧 Environment Variables Test')
console.log('=============================')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

const optionalVars = [
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'HUGGINGFACE_API_KEY'
]

console.log('\n📋 Required Variables:')
let allRequiredPresent = true
requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`❌ ${varName}: MISSING`)
    allRequiredPresent = false
  }
})

console.log('\n📋 Optional Variables:')
optionalVars.forEach(varName => {
  const value = process.env[varName]
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
  } else {
    console.log(`⚠️ ${varName}: Not set (optional)`)
  }
})

console.log('\n📊 Summary:')
if (allRequiredPresent) {
  console.log('✅ All required environment variables are set!')
  console.log('🎉 Your app should work properly now.')
} else {
  console.log('❌ Missing required environment variables!')
  console.log('\n💡 To fix this:')
  console.log('1. Create a .env.local file in your project root')
  console.log('2. Add your Supabase credentials:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  console.log('3. Restart your development server')
} 