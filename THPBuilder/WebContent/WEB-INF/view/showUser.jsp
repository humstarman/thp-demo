<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>

<div> 
欢迎<br/>  
<p>
<strong>ID</strong> <span>${user.getUserId()}</span> 
</p>
<p>
<strong>Name</strong> <span>${user.getUserName()}</span>
</p> 
<p>
<strong>Age</strong> <span>${user.getUserAge()}</span> 
</p>
</div>

</body>
</html>