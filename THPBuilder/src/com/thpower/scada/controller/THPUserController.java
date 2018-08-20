package com.thpower.scada.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.thpower.scada.mapper.THPUserMapper;
import com.thpower.scada.model.THPUser;

/**
* @author admin
* @version 创建时间：2017年11月14日 下午4:33:39
* 类说明
*/

@Controller
public class THPUserController {
	@Autowired
	private THPUserMapper _userMapper;
	
	@RequestMapping("/getUser")
	public String getUser(@RequestParam("userId") long userId, 
			HttpServletRequest request, 
			Model model){
		
		THPUser user = _userMapper.getUserById(userId);
		
		model.addAttribute("user", user); 
		
		
		return "showUser";
	}
	
}
