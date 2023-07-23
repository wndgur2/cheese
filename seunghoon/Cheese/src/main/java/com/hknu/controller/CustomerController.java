package com.hknu.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.controller.exception.CustomException;
import com.hknu.dto.CustomerDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.CustomerServiceImpl;
import com.hknu.service.PaymentServiceImpl;
import com.hknu.service.PhotographServiceImpl;
import com.hknu.service.ShareServiceImpl;
import com.hknu.service.TimelapseServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class CustomerController {
	@Autowired
	private CustomerServiceImpl customerServiceImpl;
	@Autowired
	private PaymentServiceImpl paymentServiceImpl;
	@Autowired
	private PhotographServiceImpl photographServiceImpl;
	@Autowired
	private TimelapseServiceImpl timelapseServiceImpl;
	@Autowired
	private ShareServiceImpl shareServiceImpl;
	@Autowired
	private TokenService tokenService;
	@Value("${cheese.manager-email}")
    private String manager_email;
	
	// 회원 정보 가져오기
	@GetMapping(value = "/customer/{customerId}")
	public ResponseEntity<ResponseDto<CustomerDto>> getCustomerById(@PathVariable Integer customerId, 
																	@RequestHeader(required = false, value = "Authorization") String accessToken,
																	@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {	
		ResponseEntity<ResponseDto<CustomerDto>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		CustomerDto customerDto = this.customerServiceImpl.getById(customerId);
		customerDto.setPayments(this.paymentServiceImpl.getListByCustomerId(customerId));
		customerDto.setPhotographs(this.photographServiceImpl.getListByCustomerId(customerId));
		customerDto.setTimelapses(this.timelapseServiceImpl.getListByCustomerId(customerId));
		customerDto.setShares(this.shareServiceImpl.getListByCustomerId(customerId));

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 회원 정보를 가져왔습니다.", customerDto), 
				HttpStatus.OK) ;
	}
	
	// 모든 회원 정보 가져오기
	@GetMapping(value = "/customer")
	public ResponseEntity<ResponseDto<List<CustomerDto>>> getAllCustomers(@RequestHeader(required = false, value = "Authorization") String accessToken,
																		  @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<CustomerDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			List<CustomerDto> customerDtoList = this.customerServiceImpl.getAll();
			
			for (int i = 0; i < customerDtoList.size(); i++) {
				customerDtoList.get(i).setPayments(this.paymentServiceImpl.getListByCustomerId(customerDtoList.get(i).getCustomerId()));
				customerDtoList.get(i).setPhotographs(this.photographServiceImpl.getListByCustomerId(customerDtoList.get(i).getCustomerId()));
				customerDtoList.get(i).setTimelapses(this.timelapseServiceImpl.getListByCustomerId(customerDtoList.get(i).getCustomerId()));
				customerDtoList.get(i).setShares(this.shareServiceImpl.getListByCustomerId(customerDtoList.get(i).getCustomerId()));
			}
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 모든 회원 정보를 가져왔습니다.", customerDtoList), 
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
	
	//회원가입
	@PostMapping(value = "/customer")
	public ResponseEntity<ResponseDto<Null>> insertCustomer(@RequestParam String email, @RequestParam String password, @RequestParam String nickname) {
		CustomerDto customerDto = new CustomerDto(
				this.customerServiceImpl.getMaxPkValue(), 
				email, 
				password, 
				0, 
				nickname, 
				null, 
				null, 
				null, 
				null);
		this.customerServiceImpl.insert(customerDto);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 회원가입을 했습니다."), 
				HttpStatus.OK);
	}
	
	// 사용자 비밀번호 수정하기
	@PutMapping(value = "/customer/{customerId}")
	public ResponseEntity<ResponseDto<Null>> updateCustomer(@PathVariable Integer customerId, 
														    @RequestParam String password,
														    @RequestHeader(required = false, value = "Authorization") String accessToken,
														    @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		CustomerDto customerDto = this.customerServiceImpl.getById(customerId);
		customerDto.setPassword(password);
		this.customerServiceImpl.update(customerDto);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 비밀번호를 수정했습니다."),
				HttpStatus.OK);
	}
	
	// 회원 탈퇴하기
	@DeleteMapping(value = "/customer/{customerId}")
	public ResponseEntity<ResponseDto<Null>> deleteCustomer(@PathVariable Integer customerId, 
								 @RequestHeader(required = false, value = "Authorization") String accessToken,
								 @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<Null>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		this.customerServiceImpl.delete(customerId);
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 회원 탈퇴를 했습니다."),
				HttpStatus.OK);
	}
	
	// 사용자 로그인
	@PostMapping(value = "/auth")
	public ResponseEntity<ResponseDto<Map<String, Integer>>> loginCustomer(@RequestParam String email, @RequestParam String password) {
			CustomerDto customerDto = this.customerServiceImpl.getByEmail(email);

			if (password.equals(customerDto.getPassword())) {
				String accessToken = this.tokenService.generateAccessToken(email);
				String refreshToken = this.tokenService.generateRefreshToken(email);
				
				HttpHeaders headers = new HttpHeaders();
				headers.add("Authorization", "Bearer " + accessToken);
				headers.add("Refresh-Token", "Bearer " + refreshToken);
				
				Map<String, Integer> data = new HashMap<>();
				data.put("id", customerDto.getCustomerId());
				
				return new ResponseEntity<>(
						ResponseDto.of("성공적으로 로그인 했습니다.", data), 
						headers, 
						HttpStatus.OK) ;
			}
			else {
				return new ResponseEntity<>(
						ResponseDto.of("비밀번호가 일치하지 않습니다."), 
						HttpStatus.BAD_REQUEST);
			}
	}
	
	// 사용자 로그아웃
	@DeleteMapping(value = "/auth/{customerId}")
	public ResponseEntity<ResponseDto<Null>> logoutCustomer(@PathVariable Integer customerId) {
		CustomerDto customerDto = this.customerServiceImpl.getById(customerId);
		String email = customerDto.getEmail();
		String accessToken = this.tokenService.getAccessTokenByEmail(email);
		String refreshToken = this.tokenService.getRefreshTokenByEmail(email);
		
		if (this.tokenService.validateAccessToken(accessToken)) { 
			this.tokenService.insertBlackListAccessToken(accessToken);
		}
		
		if (this.tokenService.validateRefreshToken(refreshToken)) {
			this.tokenService.insertBlackListRefreshToken(refreshToken);	
		}
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 로그아웃 했습니다."), 
				HttpStatus.OK);
	}
	
	// test
	@GetMapping(value = "/")
	public String home() {
		return "index";
	}

	// test
	@GetMapping(value = "/printAllTokens")
	public void printAllTokens() {
		this.tokenService.printAllTokens();
	}
}
