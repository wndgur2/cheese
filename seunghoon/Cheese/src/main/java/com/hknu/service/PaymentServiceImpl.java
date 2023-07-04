package com.hknu.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.hknu.dao.PaymentDaoImpl;
import com.hknu.dto.PaymentDto;
import com.hknu.entity.Payment;

@org.springframework.stereotype.Service
public class PaymentServiceImpl implements Service<PaymentDto>{
	@Autowired
	private PaymentDaoImpl paymentDaoImpl;
	
	public PaymentDto getById(int id) {
		Payment payment = this.paymentDaoImpl.getById(id);
		PaymentDto paymentDto = new PaymentDto(
				payment.getPayment_id(), 
				null,
				payment.getCost(),
				payment.getCreated_at(), 
				payment.getAmount(),
				payment.isPhoto_or_print());
		// test
		System.out.println(paymentDto.toString());
		return paymentDto;
	}
	
	public List<PaymentDto> getAll() {
		List<Payment> paymentList = this.paymentDaoImpl.getAll();
		List<PaymentDto> paymentDtoList = new ArrayList<>();
		
		for (int i = 0; i < paymentList.size(); i++) {
			Payment payment = paymentList.get(i);
			PaymentDto paymentDto = new PaymentDto(
					payment.getPayment_id(), 
					null,
					payment.getCost(),
					payment.getCreated_at(), 
					payment.getAmount(),
					payment.isPhoto_or_print());
			paymentDtoList.add(paymentDto);
		}
		//test
		System.out.println(paymentDtoList.toString());
		return paymentDtoList;
	}
	
	public void insert(PaymentDto pd) {
		Payment payment = new Payment(
				pd.getPaymentId(),
				pd.getBranch().getBranchId(),
				pd.getCost(), 
				pd.getCreatedAt(),
				pd.getAmount(), 
				pd.isPhotoOrPrint());
		this.paymentDaoImpl.insert(payment);
	}
	
	public void update(PaymentDto pd) {
		Payment payment = new Payment(
				pd.getPaymentId(),
				pd.getBranch().getBranchId(),
				pd.getCost(), 
				pd.getCreatedAt(),
				pd.getAmount(), 
				pd.isPhotoOrPrint());
		this.paymentDaoImpl.update(payment);
	}
	
	public void delete(int id) {
		this.paymentDaoImpl.delete(id);
	}
}