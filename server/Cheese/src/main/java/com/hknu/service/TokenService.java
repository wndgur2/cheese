package com.hknu.service;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hknu.dao.TokenDao;
import com.hknu.dto.response.ResponseDto;
import com.hknu.exception.CustomException;
import com.hknu.exception.InValidTokenException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@org.springframework.stereotype.Service
public class TokenService {
	@Autowired
	private TokenDao tokenDao;
    @Value("${cheese.access-token.prefix}")
    private String access_token_prefix;
    @Value("${cheese.refresh-token.prefix}")
    private String refresh_token_prefix;
    @Value("${cheese.access-token.expiration}")
    private long access_token_expiration;
    @Value("${cheese.refresh-token.expiration}")
    private long refresh_token_expiration;
    @Value("${cheese.black-list.value}")
    private String black_list_value;
    private final Key secret_key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public String getEmailByToken(String Token) {
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(secret_key)
				.build()
				.parseClaimsJws(Token)
				.getBody();
		return claims.getSubject();
	}

	public String getAccessTokenByEmail(String email) {
		String accessTokenKey = access_token_prefix + email;
		return this.tokenDao.getToken(accessTokenKey);
	}

	public String getRefreshTokenByEmail(String email) {
		String refreshTokenKey = refresh_token_prefix + email;
		return this.tokenDao.getToken(refreshTokenKey);
	}
	
	public String generateAccessToken(String email) {
		Date now = new Date();
		Date expiration = new Date(now.getTime() + access_token_expiration * 1000);
		String accessToken = Jwts.builder()
				.setSubject(email)
				.setIssuedAt(now)
				.setExpiration(expiration)
				.signWith(secret_key)
				.compact();
		
		this.tokenDao.insertToken(access_token_prefix + email, accessToken, access_token_expiration);
		
		return accessToken;
	}
	
	public String generateRefreshToken(String email) {
		Date now = new Date();
		Date expiration = new Date(now.getTime() + refresh_token_expiration * 1000);
		String refreshToken = Jwts.builder()
				.setSubject(email)
				.setIssuedAt(now)
				.setExpiration(expiration)
				.signWith(secret_key)
				.compact();

		this.tokenDao.insertToken(refresh_token_prefix + email, refreshToken, refresh_token_expiration);
		
		return refreshToken;
	}
	
	public boolean validateAccessToken(String accessToken) {
		Jwts.parserBuilder()
			.setSigningKey(secret_key)
			.build()
			.parseClaimsJws(accessToken);
	
		String blackListValue = this.tokenDao.getToken(accessToken);
	
		if (blackListValue == null || !blackListValue.equals(black_list_value)) {
			return true;
		}
		return false;
	}
	
	public boolean validateRefreshToken(String refreshToken) {
		Jwts.parserBuilder()
			.setSigningKey(secret_key)
			.build()
			.parseClaimsJws(refreshToken);
	
		String blackListValue = this.tokenDao.getToken(refreshToken);
	
		if (blackListValue == null || !blackListValue.equals(black_list_value)) {
			return true;
		}
		return false;
	}
	
	public <T> ResponseEntity<ResponseDto<T>> validateAndGenerateToken(
			String accessToken, 
			String refreshToken) {
		if (accessToken == null && refreshToken == null) {
			throw new IllegalArgumentException();
		}
		else if (accessToken != null) {
			if (!validateAccessToken(accessToken)) {
				throw new InValidTokenException();
			}
			return null;
		}
		else {
			String email = getEmailByToken(refreshToken);
			String message = "새로운 액세스 토큰을 발급했습니다.";
			String newRefreshToken = null;
			
			String newAccessToken = generateAccessToken(email);
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + newAccessToken);
			
			if (!validateRefreshToken(refreshToken)) {
				message = "새로운 액세스 토큰 및 리프레쉬 토큰을 발급했습니다.";
				newRefreshToken = generateRefreshToken(email);
				headers.add("Refresh-Token", "Bearer" + newRefreshToken);
			}

			return new ResponseEntity<>(
					ResponseDto.of(message),
					headers,
					HttpStatus.OK);
		}
	}
	
	public <T> ResponseEntity<ResponseDto<List<T>>> validateAndGenerateTokenReturnList(
			String accessToken, 
			String refreshToken) {
		if (accessToken == null && refreshToken == null) {
			throw new CustomException("권한이 필요합니다.");
		}
		else if (accessToken != null) {
			if (!validateAccessToken(accessToken)) {
				throw new InValidTokenException();
			}
			return null;
		}
		else {
			String email = getEmailByToken(refreshToken);
			String message = "새로운 액세스 토큰을 발급했습니다.";
			String newRefreshToken = null;
			
			String newAccessToken = generateAccessToken(email);
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + newAccessToken);
			
			if (!validateRefreshToken(refreshToken)) {
				message = "새로운 액세스 토큰 및 리프레쉬 토큰을 발급했습니다.";
				newRefreshToken = generateRefreshToken(email);
				headers.add("Refresh-Token", "Bearer" + newRefreshToken);
			}

			return new ResponseEntity<>(
					ResponseDto.of(message),
					headers,
					HttpStatus.OK);
		}
	}
	
	public <E, T> ResponseEntity<ResponseDto<Map<E, T>>> validateAndGenerateTokenReturnMap(
			String accessToken, 
			String refreshToken) {
		if (accessToken == null && refreshToken == null) {
			throw new IllegalArgumentException();
		}
		else if (accessToken != null) {
			if (!validateAccessToken(accessToken)) {
				throw new InValidTokenException();
			}
			return null;
		}
		else {
			String email = getEmailByToken(refreshToken);
			String message = "새로운 액세스 토큰을 발급했습니다.";
			String newRefreshToken = null;
			
			String newAccessToken = generateAccessToken(email);
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + newAccessToken);
			
			if (!validateRefreshToken(refreshToken)) {
				message = "새로운 액세스 토큰 및 리프레쉬 토큰을 발급했습니다.";
				newRefreshToken = generateRefreshToken(email);
				headers.add("Refresh-Token", "Bearer" + newRefreshToken);
			}

			return new ResponseEntity<>(
					ResponseDto.of(message),
					headers,
					HttpStatus.OK);
		}
	}
	
    public void insertBlackListAccessToken(String accessToken) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(secret_key)
                .build()
                .parseClaimsJws(accessToken);

        Claims claims = claimsJws.getBody();
        Date expiration = claims.getExpiration();
        long remainExpiration = (expiration.getTime() - System.currentTimeMillis()) / 1000 + 3;

        if (remainExpiration > 0) {
            this.tokenDao.insertToken(accessToken, black_list_value, remainExpiration);
        }
    }
    
    public void insertBlackListRefreshToken(String refreshToken) {
        Jws<Claims> claimsJws = Jwts.parserBuilder()
                .setSigningKey(secret_key)
                .build()
                .parseClaimsJws(refreshToken);

        Claims claims = claimsJws.getBody();
        Date expiration = claims.getExpiration();
        long remainExpiration = (expiration.getTime() - System.currentTimeMillis()) / 1000 + 3;

        if (remainExpiration > 0) {
            this.tokenDao.insertToken(refreshToken, black_list_value, remainExpiration);
        }
    }
	
	// test
	public void printAllTokens() {
		this.tokenDao.printAllTokens();
	}
}
