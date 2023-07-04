package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hknu.entity.Share;

@Repository
public class ShareDaoImpl extends BaseDao<Share> {
	@Autowired
	public ShareDaoImpl(DataSource dataSource) {
		super(dataSource, "Share", "share_id");
	}
	
	@Override
	public Share createObjectFromResultSet(ResultSet rs) throws SQLException {
		Share share = new Share(
				rs.getInt("share_id"),
				rs.getInt("customer_id"),
				rs.getDate("created_at"));
		return share;
	}
}
