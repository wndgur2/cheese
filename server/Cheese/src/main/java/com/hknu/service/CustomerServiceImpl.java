package com.hknu.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;

import com.hknu.dao.CustomerDaoImpl;
import com.hknu.dto.CustomerDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Customer;
import com.hknu.exception.CustomException;

@org.springframework.stereotype.Service
public class CustomerServiceImpl implements Service<CustomerDto>{
	@Autowired
	private CustomerDaoImpl customerDaoImpl;
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
	
	public ResponseEntity<ResponseDto<CustomerDto>> getCustomerById(
			Integer customerId,
			String accessToken, 
			String refreshToken) {	
		ResponseEntity<ResponseDto<CustomerDto>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 회원 정보를 가져왔습니다.", getById(customerId)), 
				HttpStatus.OK) ;
		}
		
	public ResponseEntity<ResponseDto<List<CustomerDto>>> getAllCustomers(
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<List<CustomerDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		if ((accessToken != null && this.tokenService.getEmailByToken(accessToken).equals(manager_email))
				|| (refreshToken != null && this.tokenService.getEmailByToken(refreshToken).equals(manager_email))) {
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 모든 회원 정보를 가져왔습니다.", getAll()), 
					HttpStatus.OK);
		}
		throw new CustomException("관리자 권한이 필요합니다.");
	}
		

	public ResponseEntity<ResponseDto<NullType>> insertCustomer(
			String email, 
			String password, 
			String nickname) {
		CustomerDto customerDto = new CustomerDto(
				getMaxPkValue(), 
				email, 
				BCrypt.hashpw(password, BCrypt.gensalt()), 
				0.0, 
				nickname, 
				null, 
				null, 
				null, 
				null);
		insert(customerDto);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 회원가입을 했습니다."), 
				HttpStatus.OK);
	}
		
	public ResponseEntity<ResponseDto<NullType>> updateCustomerPassword(
			Integer customerId, 
			String password,
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		CustomerDto customerDto = getById(customerId);
		customerDto.setPassword(BCrypt.hashpw(password, BCrypt.gensalt()));
		update(customerDto);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 비밀번호를 수정했습니다."),
				HttpStatus.OK);
	}

	public ResponseEntity<ResponseDto<NullType>> deleteCustomer(
			Integer customerId, 
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<NullType>> responseEntity = this.tokenService.validateAndGenerateToken(accessToken, refreshToken);

		if (responseEntity != null) {
			return responseEntity;
		}

		delete(customerId);
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 회원 탈퇴를 했습니다."),
				HttpStatus.OK);
	}
		

	public ResponseEntity<ResponseDto<Map<String, Object>>> loginCustomer(
			String email, 
			String password) {
		CustomerDto customerDto = getByEmail(email);

		if (BCrypt.checkpw(password, customerDto.getPassword())) {
			String accessToken = this.tokenService.generateAccessToken(email);
			String refreshToken = this.tokenService.generateRefreshToken(email);
			
			HttpHeaders headers = new HttpHeaders();
			headers.add("Authorization", "Bearer " + accessToken);
			headers.add("Refresh-Token", "Bearer " + refreshToken);
			
			Map<String, Object> data = new HashMap<>();
			data.put("id", customerDto.getCustomerId());
			data.put("nickname", customerDto.getNickname());
			data.put("email", customerDto.getEmail());
			
			return new ResponseEntity<>(
					ResponseDto.of("성공적으로 로그인 했습니다.", data), 
					headers, 
					HttpStatus.OK) ;
		} else {
			return new ResponseEntity<>(
					ResponseDto.of("비밀번호가 일치하지 않습니다."), 
					HttpStatus.BAD_REQUEST);
		}
	}
		

	public ResponseEntity<ResponseDto<NullType>> logoutCustomer(Integer customerId) {
		CustomerDto customerDto = getById(customerId);
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
	
	public String getNickNameById(Integer id) {
		Customer customer = this.customerDaoImpl.getById(id);
		return customer.getNickname();
	}
	
	public CustomerDto getById(Integer id) {
		Customer customer = this.customerDaoImpl.getById(id);
		CustomerDto customerDto = new CustomerDto(
				customer.getCustomer_id(),
				customer.getEmail(), 
				customer.getPassword(),
				customer.getCloud_size(), 
				customer.getNickname(), 
				this.paymentServiceImpl.getListByCustomerId(id), 
				this.photographServiceImpl.getListByCustomerId(id), 
				this.timelapseServiceImpl.getListByCustomerId(id), 
				this.shareServiceImpl.getListByCustomerId(id));

		return customerDto;
	}
	
	public List<CustomerDto> getAll() {
		List<Customer> customerList = this.customerDaoImpl.getAll();
		List<CustomerDto> customerDtoList = new ArrayList<>();
		
		for (int i = 0; i < customerList.size(); i++) {
			Customer customer = customerList.get(i);
			CustomerDto customerDto = new CustomerDto(
					customer.getCustomer_id(),
					customer.getEmail(), 
					customer.getPassword(),
					customer.getCloud_size(), 
					customer.getNickname(), 
					this.paymentServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
					this.photographServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
					this.timelapseServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
					this.shareServiceImpl.getListByCustomerId(customer.getCustomer_id()));
			customerDtoList.add(customerDto);
		}

		return customerDtoList;
	}
	
	public void insert(CustomerDto cd) {
		Customer customer = new Customer(
				cd.getCustomerId(),
				cd.getEmail(), 
				cd.getPassword(),
				cd.getCloudSize(), 
				cd.getNickname());
		this.customerDaoImpl.insert(customer);
	}
	
	public void update(CustomerDto cd) {
		Customer customer = new Customer(
				cd.getCustomerId(),
				cd.getEmail(), 
				cd.getPassword(),
				cd.getCloudSize(), 
				cd.getNickname());
		this.customerDaoImpl.update(customer);
	}
	
	public void delete(Integer id) {
		this.customerDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.customerDaoImpl.getMaxPkValue();
	}
	
	public CustomerDto getByEmail(String email) {
		Customer customer = this.customerDaoImpl.getByEmail(email);
		CustomerDto customerDto = new CustomerDto(
				customer.getCustomer_id(),
				customer.getEmail(), 
				customer.getPassword(),
				customer.getCloud_size(), 
				customer.getNickname(), 
				this.paymentServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
				this.photographServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
				this.timelapseServiceImpl.getListByCustomerId(customer.getCustomer_id()), 
				this.shareServiceImpl.getListByCustomerId(customer.getCustomer_id()));

		return customerDto;
	}
}
