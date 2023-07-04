package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Payment;

@Repository
public class PaymentDaoImpl extends BaseDao<Payment> {
	@Autowired
	public PaymentDaoImpl(DataSource dataSource) {
		super(dataSource, "Payments", "payment_id");
	}
	
	@Override
	public Payment createObjectFromResultSet(ResultSet rs) throws SQLException {
		Payment payment = new Payment(
				rs.getInt("payment_id"),
				rs.getInt("customer_id"),
				rs.getInt("branch_id"),
				rs.getInt("cost"),
				rs.getDate("created_at"),
				rs.getInt("amount"),
				rs.getBoolean("photo_or_print"));
		return payment;
	}
}