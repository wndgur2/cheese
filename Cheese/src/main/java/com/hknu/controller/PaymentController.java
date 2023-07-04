package com.hknu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.hknu.dto.PaymentDto;
import com.hknu.service.PaymentServiceImpl;

@Controller
public class PaymentController {
	@Autowired
	private PaymentServiceImpl PaymentServiceImpl;
	
	public String getPaymentById(int id, Model model) {
		return null;
	}
	
	public String getAllPayments(Model model) {
		return null;
	}
	
	public String newPayment(Model model) {
		return null;
	}
	
	public String insertPayment(PaymentDto pd) {
		return null;
	}
	
	public String updatePayment(PaymentDto pd) {
		return null;
	}
	
	public String deletePayment(int id) {
		return null;
	}
}
