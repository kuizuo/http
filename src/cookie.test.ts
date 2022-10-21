import { expect, test } from 'vitest'
import tough from 'tough-cookie'

test.skip('tough.Cookie', async () => {
  const Cookie = tough.Cookie
  const setCookieStr = 'a=123; Path=/; HttpOnly; SameSite=Lax; Secure; Expires=Sun, 01 Aug 2021 08:00:00 GMT; Max-Age=86400;'
  const cookie = Cookie.parse(setCookieStr)

  const cookieString = cookie!.cookieString()
  expect(cookieString).toEqual('a=123')

  const cookiejar = new tough.CookieJar()
  const tempCookie = await cookiejar.setCookie(
    cookieString,
    'https://currentdomain.example.com/path',
  )

  console.log(tempCookie)

  expect(cookiejar.getCookieStringSync('https://currentdomain.example.com')).toEqual('a=123')
  expect(await cookiejar.getCookies('https://other.example.com')).toEqual([])
})

test.skip('Cookie.fromJSON', async () => {
  const Cookie = tough.Cookie
  const cookieObj = {
    key: 'a',
    value: '123',
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
    expires: new Date('Sun, 01 Aug 2021 08:00:00 GMT'),
    maxAge: 86400,

  }
  const cookie = Cookie.fromJSON(cookieObj)

  expect(cookie!.cookieString()).toEqual('a=123')
})

