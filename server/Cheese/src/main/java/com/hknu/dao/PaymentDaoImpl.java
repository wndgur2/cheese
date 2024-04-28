package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Payment;

@Repository
public class PaymentDaoImpl extends BaseDao<Payment> {
	@Autowired
	public PaymentDaoImpl(DataSource dataSource) {
		super(dataSource, "payments", "payment_id");
	}
	
	@Override
	public Payment createObjectFromResultSet(ResultSet rs) throws SQLException {
		long koreaTimeMillis = rs.getTimestamp("created_at").getTime() - (9 * 60 * 60 * 1000);
		Timestamp koreaTimestamp = new Timestamp(koreaTimeMillis);
		Payment payment = new Payment(
				rs.getInt("payment_id"),
				rs.getInt("customer_id"),
				rs.getInt("branch_id"),
				rs.getInt("cost"),
				koreaTimestamp,
				rs.getInt("amount"),
				rs.getBoolean("photo_or_print"));
		return payment;
	}
	
	public List<Payment> getListByCustomerId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE customer_id=?;", tableName);

		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Payment>>() { 
			public List<Payment> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<Payment> objectList = new ArrayList<>();
					Payment firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						Payment object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;	
				}
				return null;
			}
		}, id);
	}
}