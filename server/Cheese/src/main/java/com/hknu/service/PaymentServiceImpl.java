package com.hknu.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.lang.model.type.NullType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.hknu.dao.PaymentDaoImpl;
import com.hknu.dto.PaymentDto;
import com.hknu.dto.response.ResponseDto;
import com.hknu.entity.Payment;

@org.springframework.stereotype.Service
public class PaymentServiceImpl implements Service<PaymentDto>{
	@Autowired
	private PaymentDaoImpl paymentDaoImpl;
	@Autowired
	private TokenService tokenService;
	

	public ResponseEntity<ResponseDto<NullType>> insertPayment(
			Integer branchId, 
			Integer customerId,
			Integer cost,
			Integer amount,
			boolean photo_or_print) {
		Timestamp date = new Timestamp(System.currentTimeMillis() + (9 * 60 * 60 * 1000));
		PaymentDto paymentDto = new PaymentDto(
				getMaxPkValue(), 
				customerId, 
				branchId, 
				cost, 
				date, 
				amount, 
				photo_or_print);
		insert(paymentDto);

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 결제내역을 추가했습니다."), 
				HttpStatus.OK);
	}
	
	public ResponseEntity<ResponseDto<List<PaymentDto>>> getCustomerPayments(
			Integer customerId, 
			String accessToken,
			String refreshToken) {
		ResponseEntity<ResponseDto<List<PaymentDto>>> responseEntity = this.tokenService.validateAndGenerateTokenReturnList(accessToken, refreshToken);
		
		if (responseEntity != null) {
			return responseEntity;
		}

		return new ResponseEntity<>(
				ResponseDto.of("성공적으로 모든 결제내역을 가져왔습니다.", getListByCustomerId(customerId)),
				HttpStatus.OK);
	}
	
	public PaymentDto getById(Integer id) {
		Payment payment = this.paymentDaoImpl.getById(id);
		PaymentDto paymentDto = new PaymentDto(
				payment.getPayment_id(), 
				payment.getCustomer_id(),
				payment.getBranch_id(),
				payment.getCost(),
				payment.getCreated_at(), 
				payment.getAmount(),
				payment.isPhoto_or_print());

		return paymentDto;
	}
	
	public List<PaymentDto> getAll() {
		List<Payment> paymentList = this.paymentDaoImpl.getAll();
		List<PaymentDto> paymentDtoList = new ArrayList<>();
		
		for (int i = 0; i < paymentList.size(); i++) {
			Payment payment = paymentList.get(i);
			PaymentDto paymentDto = new PaymentDto(
					payment.getPayment_id(), 
					payment.getCustomer_id(),
					payment.getBranch_id(),
					payment.getCost(),
					payment.getCreated_at(), 
					payment.getAmount(),
					payment.isPhoto_or_print());
			paymentDtoList.add(paymentDto);
		}

		return paymentDtoList;
	}
	
	public void insert(PaymentDto pd) {
		Payment payment = new Payment(
				pd.getPaymentId(),
				pd.getCustomerId(),
				pd.getBranchId(),
				pd.getCost(), 
				pd.getCreatedAt(),
				pd.getAmount(), 
				pd.isPhotoOrPrint());
		this.paymentDaoImpl.insert(payment);
	}
	
	public void update(PaymentDto pd) {
		Payment payment = new Payment(
				pd.getPaymentId(),
				pd.getCustomerId(),
				pd.getBranchId(),
				pd.getCost(), 
				pd.getCreatedAt(),
				pd.getAmount(), 
				pd.isPhotoOrPrint());
		this.paymentDaoImpl.update(payment);
	}
	
	public void delete(Integer id) {
		this.paymentDaoImpl.delete(id);
	}
	
	public Integer getMaxPkValue() {
		return this.paymentDaoImpl.getMaxPkValue();
	}
	
	public List<PaymentDto> getListByCustomerId(Integer id) {
		List<Payment> paymentList = this.paymentDaoImpl.getListByCustomerId(id);
		List<PaymentDto> paymentDtoList = new ArrayList<>();
		
		if (paymentList == null) {
			return null;
		}
		
		for (int i = 0; i < paymentList.size(); i++) {
			Payment payment = paymentList.get(i);
			PaymentDto paymentDto = new PaymentDto(
					payment.getPayment_id(), 
					payment.getCustomer_id(),
					payment.getBranch_id(),
					payment.getCost(),
					payment.getCreated_at(), 
					payment.getAmount(),
					payment.isPhoto_or_print());
			paymentDtoList.add(paymentDto);
		}
		return paymentDtoList;
	}
}