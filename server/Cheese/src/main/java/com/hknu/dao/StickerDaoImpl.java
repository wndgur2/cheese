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

import com.hknu.entity.Sticker;

@Repository
public class StickerDaoImpl extends BaseDao<Sticker> {
	@Autowired
	public StickerDaoImpl(DataSource dataSource) {
		super(dataSource, "stickers", "sticker_id");
	}
	
	@Override
	public Sticker createObjectFromResultSet(ResultSet rs) throws SQLException {
		Sticker sticker = new Sticker(
				rs.getInt("sticker_id"),
				rs.getInt("branch_id"),
				rs.getBytes("sticker_image"));
		return sticker;
	}
	
	public List<Sticker> getListByBranchId(Integer id) {
		String sql = String.format("SELECT * FROM %s WHERE branch_id", tableName);
		
		if (id == null) {
			sql += " is null;";
		}
		else {
			sql += String.format("=%s;", id);
		}

		return getJdbcTemplate().query(sql, new ResultSetExtractor<List<Sticker>>() { 
			public List<Sticker> extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					List<Sticker> objectList = new ArrayList<>();
					Sticker firstObject = createObjectFromResultSet(rs);
					objectList.add(firstObject);

					while (rs.next()) {
						Sticker object = createObjectFromResultSet(rs);
						objectList.add(object);
					}
					return objectList;
				}
				return null;
			}
		});
	}
}