package com.hknu.controller;

import java.sql.Timestamp;
import java.util.List;

import org.apache.tomcat.jakartaee.commons.lang3.ObjectUtils.Null;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hknu.dto.PaymentDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.service.PaymentServiceImpl;
import com.hknu.service.TokenService;

@RestController
public class PaymentController {
	@Autowired
	private PaymentServiceImpl paymentServiceImpl;
	@Autowired
	private TokenService tokenService;
	
	// 결제내역 추가하기
	@PostMapping(value = "/branch/{branchId}/payment")
	public ResponseEntity<ResponseDto<Null>> insertPayment(@PathVariable Integer branchId, 
								@RequestParam(required = false) Integer customerId,
								@RequestParam Integer cost,
								@RequestParam Integer amount,
								@RequestParam boolean photo_or_print) {
		
		Timestamp date = new Timestamp(System.currentTimeMillis() + (9 * 60 * 60 * 1000));
		PaymentDto paymentDto = new PaymentDto(
				this.paymentServiceImpl.getMaxPkValue(), 
				customerId, 
				branchId, 
				cost, 
				date, 
				amount, 
				photo_or_print);
		this.paymentServiceImpl.insert(paymentDto);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 결제내역을 추가했습니다."), 
				HttpStatus.OK);
	}
	
	// 결제내역 가져오기
	@GetMapping(value = "/customer/{customerId}/payment")
	public ResponseEntity<ResponseDto<List<PaymentDto>>> getCustomerPayments(@PathVariable Integer customerId, 
																			 @RequestHeader(required = false, value = "Authorization") String accessToken,
																			 @RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		ResponseEntity<ResponseDto<List<PaymentDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}
		
		List<PaymentDto> paymentDtoList = this.paymentServiceImpl.getListByCustomerId(customerId);
		
		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 결제내역을 가져왔습니다.", paymentDtoList),
				HttpStatus.OK);
	}
	
//	public String getPaymentById(Integer id) {
//		return null;
//	}
//	
//	public String getAllPayments() {
//		return null;
//	}
//	
//	public String updatePayment(PaymentDto pd) {
//		return null;
//	}
//	
//	public String deletePayment(Integer id) {
//		return null;
//	}
}
