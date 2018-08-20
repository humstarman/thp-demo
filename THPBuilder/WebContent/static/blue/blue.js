mxPopupMenu.prototype.addSeparator = function(a, b) {
				    a = a || this;
				    if (this.smartSeparators && !b) a.willAddSeparator = !0;
				    else if (null != a.tbody) {
				        a.willAddSeparator = !1;
				        var c = document.createElement("tr");
				        c.setAttribute("height","1" );			        
				        d = document.createElement("td");
				        d.style.background="#9FBFE9";
				        c.appendChild(d);
				        d = document.createElement("td");
				        d.style.background="#000000";
				        d.setAttribute("colSpan", "2");
				        c.appendChild(d);
				        a.tbody.appendChild(c)
				    }
				};