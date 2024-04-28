package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Customer;

@Repository
public class CustomerDaoImpl extends BaseDao<Customer> {
	@Autowired
	public CustomerDaoImpl(DataSource dataSource) {
		super(dataSource, "customers", "customer_id");
	}
	
	@Override
	public Customer createObjectFromResultSet(ResultSet rs) throws SQLException {
		Customer customer = new Customer(
				rs.getInt("customer_id"),
				rs.getString("email"),
				rs.getString("password"),
				rs.getDouble("cloud_size"),
				rs.getString("nickname"));
		return customer;
	}
	
	public Customer getByEmail(String email) {
		String sql = String.format("SELECT * FROM %s WHERE email=?;", tableName);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<Customer>() { 
			public Customer extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					Customer object = createObjectFromResultSet(rs);
					return object;
				}
				throw new NullPointerException("이메일이 존재하지 않습니다.");
			}
		}, email);
	}
}
