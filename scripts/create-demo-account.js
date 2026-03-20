import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "http://127.0.0.1:54321"
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_for_local"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function createAdmin() {
  const email = "test@orderapp.pro"
  const password = "Test12345"

  console.log(`Creating user ${email}...`)
  
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: "System Admin" }
  })

  if (authError) {
    if (authError.message.includes("already registered") || authError.message.includes("already exist")) {
      console.log("User already exists inside auth. Skipping creation, but will update role.")
      
      // Try to find the user id
      // Since it's admin, we can query auth.users? Wait, admin api has listUsers
      const { data: usersData } = await supabase.auth.admin.listUsers()
      const existingUser = usersData.users.find(u => u.email === email)
      
      if (existingUser) {
         console.log(`Found existing user ID: ${existingUser.id}`)
         const { error: upsertError } = await supabase.from("users").upsert({
           id: existingUser.id,
           email: existingUser.email,
           name: "System Admin",
           role: "admin"
         })
         
         if (upsertError) console.error("Error upserting:", upsertError)
         else console.log("Successfully made user an admin!")
      }
      return
    }
    
    console.error("Auth Error:", authError)
    return
  }

  console.log("Auth user created:", authData.user.id)
  
  // 2. Insert into users table as admin
  const { error: dbError } = await supabase.from("users").upsert({
    id: authData.user.id,
    email,
    name: "System Admin",
    role: "admin"
  })

  if (dbError) {
    console.error("Database Error:", dbError)
    return
  }

  console.log("Successfully created and elevated user to admin!")
}

createAdmin()
