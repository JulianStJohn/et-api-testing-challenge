//const { CookieJar } = require("../shared/cookiejar");
const CookieJar = require("../shared/cookiejar.js");
const  assert  = require('node:assert').strict;
const prettyPrint = require('@base2/pretty-print-object').prettyPrint;
 

// oh... "Passing arrow functions (aka “lambdas”) to Mocha is discouraged. Lambdas lexically bind this and cannot
// access the Mocha context. For example, the following code will fail:"

describe('CookieJar Class', function () {
  describe('parseCookieString()', function () {
    const cookieString = "id=abc; expires=Mon, 31-Dec-2038 23:59:59 GMT; path=/; domain=.test.com.au; Secure; HttpOnly;";
    const jar = new CookieJar()
    it('when parsing a minimal cookie string, should return cookie key value pair in hash', function () {
      assert.equal(jar.parseCookieString("sess=1")['sess'], "1");
    });
    it('when parsing a valid cookie string, should return cookie key value pair in hash', function () {
      assert.equal(jar.parseCookieString(cookieString)['id'], "abc");
    });
    it('when parsing a valid cookie string with a domain, should return domain key value pair in hash', function () {
        assert.equal(jar.parseCookieString(cookieString)['domain'], ".test.com.au");
    });
    it('when parsing a valid cookie string with security keywords, should return security keywords in an array with key "securityPolicy"', function () {
        assert.deepEqual(jar.parseCookieString(cookieString)['securityPolicy'], ['Secure','HttpOnly']);
    });

  });

  describe('Integration', function(){
    const url = "http://search.test.com.au/homePage.html"
    const cookieString = "profile=mark; domain=.test.com.au; Secure; HttpOnly;";

    it('getCookies called before addCookie should return an empty string',() => {
      const jar = new CookieJar();
      assert.equal(jar.getCookies(url), "");
    })
     
    it('getCookieKeyFromParsedCookie should return the cookie Key',() => {
      const jar = new CookieJar();
      assert.equal(jar.getCookieKeyFromParsedCookie(jar.parseCookieString(cookieString)), "profile");
    })
    
    it('getCookies should return only the cookie key value after being added by addCookie',() => {
      const jar = new CookieJar(); 
      jar.addCookie(url, cookieString);
      assert.equal(jar.getCookies(url), "profile=mark");
    }) 
     
    it('getCookies should return multiple cookies in a string after multiple cookies have been added by addCookie',() => {
      const jar = new CookieJar();
      jar.addCookie(url, cookieString); 
      jar.addCookie(url, "sess=1");
      assert.equal(jar.getCookies(url), "profile=mark; sess=1;");
    }) 



  })
});