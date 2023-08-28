package com.hknu.controller;

import java.util.List;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
public class PaymentController {
	@Autowired
	private PaymentServiceImpl paymentServiceImpl;
	
	// 결제내역 추가하기
	@PostMapping(value = "/branch/{branchId}/payment")
	public ResponseEntity<ResponseDto<NullType>> insertPayment(
			@PathVariable Integer branchId, 
			@RequestParam(required = false) Integer customerId,
			@RequestParam Integer cost,
			@RequestParam Integer amount,
			@RequestParam boolean photo_or_print) {
		return this.paymentServiceImpl.insertPayment(branchId, customerId, cost, amount, photo_or_print);
	}
	
	// 결제내역 가져오기
	@GetMapping(value = "/customer/{customerId}/payment")
	public ResponseEntity<ResponseDto<List<PaymentDto>>> getCustomerPayments(
			@PathVariable Integer customerId, 
			@RequestHeader(required = false, value = "Authorization") String accessToken,
			@RequestHeader(required = false, value = "Refresh-Token") String refreshToken) {
		return this.paymentServiceImpl.getCustomerPayments(customerId, accessToken, refreshToken);
	}
}
