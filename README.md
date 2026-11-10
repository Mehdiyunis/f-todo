# F-todo

Azərbaycan dilində gündəlik və vaxtsız işlər üçün Next.js tətbiqi.

## İşə salmaq

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Supabase qurulmayıbsa todo-lar brauzerin `localStorage` yaddaşında qalır. Supabase qoşulduqda daxil olan istifadəçinin todo-ları buludla sinxronlaşır.

## Supabase qoşulması

1. Supabase layihəsi yaradın və `.env.local` daxilində `NEXT_PUBLIC_SUPABASE_URL` və `NEXT_PUBLIC_SUPABASE_ANON_KEY` dəyərlərini yazın.
2. `supabase/schema.sql` məzmununu Supabase SQL Editor-da icra edin.
3. Supabase Authentication bölməsində Email provider-i aktiv edin və **Confirm email** seçimini yandırın. URL Configuration-da Site URL-ni tətbiqinizin ünvanına təyin edin, Redirect URLs siyahısına `http://localhost:3000/**` və yayımlanmış saytınızın origin-ini əlavə edin.
4. Google ilə giriş üçün Google provider-i aktiv edin, Google OAuth Client ID/Secret dəyərlərini əlavə edin və Supabase callback URL-ni Google Cloud Console-da icazəli redirect URL kimi qeyd edin.

Email/şifrə ilə qeydiyyatda Supabase təsdiq linki göndərir. Google OAuth-da e-poçt doğrulaması Google hesabı üzərindən aparılır. İstifadəçilər Supabase Auth-da, todo-lar isə RLS ilə qorunan `public.todos` cədvəlində saxlanılır.

Gündəlik xatırlatmalar brauzer bildiriş icazəsi ilə, tətbiq açıq olduğu müddətdə işləyir. Bildiriş icazəsi ilk gündəlik todo yaradılarkən soruşulur.

## Google SMTP ilə təsdiq e-poçtları

Təsdiq məktubları tətbiqdən deyil, Supabase Auth-dan göndərilir. Supabase Dashboard-da **Authentication → Emails → SMTP Settings** bölməsində custom SMTP-ni aktiv edib bu məlumatları daxil edin:

- Host: `smtp.gmail.com`
- Port: `587` (TLS/STARTTLS)
- Username: tam Gmail ünvanı
- Password: Google App Password
- Sender email: həmin Gmail ünvanı
- Sender name: `F-todo`

Google hesabında 2-Step Verification aktiv edin, sonra Google Account-un App Passwords səhifəsindən ayrıca tətbiq şifrəsi yaradın. Adi Google hesab şifrəsini SMTP Password sahəsinə yazmayın. App Password seçimi bəzi Workspace, Advanced Protection və yalnız security key istifadə edən hesablarda görünməyə bilər; Workspace hesabıdırsa administratorun SMTP siyasətini yoxlayın.

SMTP istifadəçi adı və App Password-u `.env.local`-a və ya repoya əlavə etməyin; onları yalnız Supabase Dashboard-un SMTP Settings bölməsinə daxil edin. Auth email-ləri və təsdiq linkini Supabase Dashboard-da **Authentication → Email Templates** bölməsindən tənzimləmək mümkündür.
