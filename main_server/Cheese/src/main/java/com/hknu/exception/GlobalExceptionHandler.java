package com.hknu.exception;

import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;

import org.apache.tomcat.util.http.fileupload.impl.FileSizeLimitExceededException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.hknu.dto.response.ResponseDto;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.lettuce.core.RedisCommandTimeoutException;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
	
	@ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolation(SQLException e) {
		String message = e.getMessage();
		if (message.contains("nickname_UNIQUE")) { 
			return new ResponseEntity<>(
					ResponseDto.of("중복된 닉네임입니다."),
					HttpStatus.BAD_REQUEST);
		} else if (message.contains("email_UNIQUE")) {
			return new ResponseEntity<>(
					ResponseDto.of("중복된 이메일입니다."), 
					HttpStatus.BAD_REQUEST);
		} else return null;
    }
	
	@ExceptionHandler({DataIntegrityViolationException.class})
	public ResponseEntity<?> handleIntegrityViolation(DataAccessException e) {
		String message = e.getMessage();
		if (message.contains("email_UNIQUE")) {
			return new ResponseEntity<>(
					ResponseDto.of("중복된 이메일입니다."),
					HttpStatus.BAD_REQUEST);
		} else if (message.contains("nickname_UNIQUE")) {
			return new ResponseEntity<>(
					ResponseDto.of("중복된 닉네임입니다."),
					HttpStatus.BAD_REQUEST);
		} else {
			return new ResponseEntity<>(
					ResponseDto.of("비밀번호가 너무 깁니다."),
					HttpStatus.BAD_REQUEST);
		}
	}

	@ExceptionHandler(NullPointerException.class)
	public ResponseEntity<?> handleNullPointer(NullPointerException e) {
		return new ResponseEntity<>(
				ResponseDto.of(e.getMessage()), 
				HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(JwtException.class)
	public ResponseEntity<?> handleJwt(JwtException e) {
		return new ResponseEntity<>(
				ResponseDto.of("신뢰할 수 없는 토큰입니다."),
				HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(ExpiredJwtException.class)
	public ResponseEntity<?> handleExpiredJwt(ExpiredJwtException e) {
		return new ResponseEntity<>(
				ResponseDto.of("토큰이 만료됐습니다."),
				HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler(CannotGetJdbcConnectionException.class)
	public ResponseEntity<?> handleCannotGetJdbcConnection(CannotGetJdbcConnectionException e) {
		return new ResponseEntity<>(
				ResponseDto.of("DB 서버에 연결할 수 없습니다."),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(RedisCommandTimeoutException.class)
	public ResponseEntity<?> handleSocket(RedisCommandTimeoutException e) {
		return new ResponseEntity<>(
				ResponseDto.of("캐시 서버 요청 시간이 만료됐습니다."),
				HttpStatus.REQUEST_TIMEOUT);
	}
	
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException e) {
		return new ResponseEntity<>(
				ResponseDto.of("로그인이 필요합니다."),
				HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler(FileSizeLimitExceededException.class)
	public ResponseEntity<?> handleFileSizeLimitExceeded(FileSizeLimitExceededException e) {
		String str = e.getMessage();
		String strSize = str.replaceAll("[^\\d]", "");
		Long sizeOfMegaBytes = Long.parseLong(strSize) / 1024;
		return new ResponseEntity<>(
				ResponseDto.of(String.format("업로드 크기는 최대 %dMB 입니다.", sizeOfMegaBytes)),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(DoNotMatchImageTypeException.class)
	public ResponseEntity<?> handledodoNotMatchImageType(DoNotMatchImageTypeException e) {
		return new ResponseEntity<>(
				ResponseDto.of("이미지 파일 형식이 아닙니다. "
						+ "파일 형식은 .jpeg, .png, .bmp, .tiff 이어야 합니다."),
				HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(DoNotMatchVideoTypeException.class)
	public ResponseEntity<?> handledodoNotMatchVideoType(DoNotMatchVideoTypeException e) {
		return new ResponseEntity<>(
				ResponseDto.of("비디오 파일 형식이 아닙니다. "
						+ "파일 형식은 .mp4, .avi, .mov, .mkv, .flv, .webm 이어야 합니다."),
				HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(CustomException.class)
	public ResponseEntity<?> handleCustom(CustomException e) {
		return new ResponseEntity<>(
				ResponseDto.of(e.getMessage()),
				HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(InValidTokenException.class)
	public ResponseEntity<?> handleInValidToken(InValidTokenException e) {
		return new ResponseEntity<>(
				ResponseDto.of("유효하지 않은 토큰입니다."), 
				HttpStatus.UNAUTHORIZED);
	}
}
