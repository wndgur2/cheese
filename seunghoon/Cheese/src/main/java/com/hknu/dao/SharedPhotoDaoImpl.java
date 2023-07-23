package com.hknu.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.hknu.entity.SharedPhoto;

@Repository
public class SharedPhotoDaoImpl extends BaseDao<SharedPhoto> {
	@Autowired
	public SharedPhotoDaoImpl(DataSource dataSource) {
		super(dataSource, "Sharedphoto", "shared_photo_id");
	}
	
	@Override
	public SharedPhoto createObjectFromResultSet(ResultSet rs) throws SQLException {
		SharedPhoto sharedPhoto = new SharedPhoto(
				rs.getInt("shared_photo_id"),
				rs.getInt("share_id"),
				rs.getInt("photograph_id"));
		return sharedPhoto;
	}
	
	public List<SharedPhoto> getListByShareId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE share_id=?;", tableName);
		
		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<SharedPhoto>>() { 
			public List<SharedPhoto> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<SharedPhoto> objectList = new ArrayList<>();
					SharedPhoto firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						SharedPhoto object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		}, id);
	}
}
