package com.hknu.dao;

import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TokenDao {
	private final RedisTemplate<String, String> redisTemplate;
	
	@Autowired
	public TokenDao(RedisTemplate<String, String> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}
	
	public String getToken(String tokenKey) {
		return redisTemplate.opsForValue().get(tokenKey);
	}
	
	public void insertToken(String key, String token, long expiration) {
		redisTemplate.opsForValue().set(key, token);
		redisTemplate.expire(key, expiration, TimeUnit.SECONDS);
	}
	
	// test
	public void printAllTokens() {
	    Set<String> tokenKeys = redisTemplate.keys("*");
	    
	    System.out.println("Redis Token");

	    for (String tokenKey : tokenKeys) {
	        String token = redisTemplate.opsForValue().get(tokenKey);
	        System.out.println(String.format("key : %s, value : %s", tokenKey, token));
	    }
	}
}
