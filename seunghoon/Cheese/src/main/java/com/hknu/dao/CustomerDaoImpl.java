package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Customer;

@Repository
public class CustomerDaoImpl extends BaseDao<Customer> {
	@Autowired
	public CustomerDaoImpl(DataSource dataSource) {
		super(dataSource, "Customers", "customer_id");
	}
	
	@Override
	public Customer createObjectFromResultSet(ResultSet rs) throws SQLException {
		Customer customer = new Customer(
				rs.getInt("customer_id"),
				rs.getString("email"),
				rs.getString("password"),
				rs.getFloat("cloud_size"),
				rs.getString("nickname"));
		return customer;
	}
}
