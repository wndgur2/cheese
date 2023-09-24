package com.hknu.controller;

import java.util.List;
import java.util.Map;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.dto.CustomerDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.CustomerServiceImpl;

@RestController
public class CustomerController {
	@Autowired
	private CustomerServiceImpl customerServiceImpl;

	// 회원 정보 가져오기
	@GetMapping(value = "/customer/{customerId}")
	public ResponseEntity<ResponseDto<CustomerDto>> getCustomerById(
			@PathVariable Integer customerId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {	
		return this.customerServiceImpl.getCustomerById(customerId, accessToken, refreshToken);
	}
	
	// 모든 회원 정보 가져오기
	@GetMapping(value = "/customer")
	public ResponseEntity<ResponseDto<List<CustomerDto>>> getAllCustomers(
			@RequestHeader(required = false, value = "Authorization") String accessToken, 
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.customerServiceImpl.getAllCustomers(accessToken, refreshToken);
	}
	
	//회원가입
	@PostMapping(value = "/customer")
	public ResponseEntity<ResponseDto<NullType>> insertCustomer(
			@RequestParam String email, 
			@RequestParam String password, 
			@RequestParam String nickname) {
		return this.customerServiceImpl.insertCustomer(email, password, nickname);
	}
	
	// 사용자 비밀번호 수정하기
	@PutMapping(value = "/customer/{customerId}")
	public ResponseEntity<ResponseDto<NullType>> updateCustomerPassword(
			@PathVariable Integer customerId, 
			@RequestParam String password,
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.customerServiceImpl.updateCustomerPassword(customerId, password, accessToken, refreshToken);
	}
	
	// 회원 탈퇴하기
	@DeleteMapping(value = "/customer/{customerId}")
	public ResponseEntity<ResponseDto<NullType>> deleteCustomer(
			@PathVariable Integer customerId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.customerServiceImpl.deleteCustomer(customerId, accessToken, refreshToken);
	}
	
	// 사용자 로그인
	@PostMapping(value = "/auth")
	public ResponseEntity<ResponseDto<Map<String, Object>>> loginCustomer(
			@RequestParam String email,
			@RequestParam String password) {
		return this.customerServiceImpl.loginCustomer(email, password);
	}
	
	// 사용자 로그아웃
	@DeleteMapping(value = "/auth/{customerId}")
	public ResponseEntity<ResponseDto<NullType>> logoutCustomer(@PathVariable Integer customerId) {
		return this.customerServiceImpl.logoutCustomer(customerId);
	}
	
	// test
	@GetMapping(value = "/")
	public String home() {
		return "index";
	}
}
