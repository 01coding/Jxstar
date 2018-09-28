/** 
 * 此控件支持Ext3.2及以上版本 
 * 用法与Ext.form.DateField一样 
 * 例如：var startDt = new Ext.ux.DateTimeField({fieldLabel:'开始时间',name:'startTm'}); 
 */  
Ext.ux.DateTimeField = Ext.extend(Ext.form.DateField, {  
    width:145,
    format:'Y-m-d H:i:s',  
	onSelect : function(m, d){//标准DateField被JxExt扩展了，这里还原
		this.setValue(d);
		this.fireEvent('select', this, d);
		this.menu.hide();
	},
    onTriggerClick : function(){
        if(this.readOnly || this.disabled){  
            return;  
        }  
        if(this.menu == null){  
            this.menu = new Ext.ux.DateTimeMenu({  
                hideOnClick: false,  
                focusOnSelect: false  
            });  
        }  
        this.onFocus();  
        Ext.apply(this.menu.picker,  {  
            minDate : this.minValue,  
            maxDate : this.maxValue,  
            disabledDatesRE : this.disabledDatesRE,  
            disabledDatesText : this.disabledDatesText,  
            disabledDays : this.disabledDays,  
            disabledDaysText : this.disabledDaysText,  
            format : this.format,  
            showToday : this.showToday,  
            minText : String.format(this.minText, this.formatDate(this.minValue)),  
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))  
        });  
        this.menu.picker.setValue(this.getValue() || new Date());  
        this.menu.show(this.el, "tl-bl?");  
        this.menuEvents('on');  
    },  
    getErrors: function(value) {  
        var errors = Ext.form.DateField.superclass.getErrors.apply(this, arguments);  
  
        value = this.formatDate(value || this.processValue(this.getRawValue()));  
  
        if (value.length < 1) { // if it's blank and textfield didn't flag it then it's valid  
             return errors;  
        }  
  
        var svalue = value;  
        value = this.parseDate(value);  
        if (!value) {  
            errors.push(String.format(this.invalidText, svalue, this.format));  
            return errors;  
        }  
  
        var time = value.getTime();  
        if (this.minValue && time < this.minValue.getTime()) {  
            errors.push(String.format(this.minText, this.formatDate(this.minValue)));  
        }  
  
        if (this.maxValue && time > this.maxValue.getTime()) {  
            errors.push(String.format(this.maxText, this.formatDate(this.maxValue)));  
        }  
  
        if (this.disabledDays) {  
            var day = value.getDay();  
  
            for(var i = 0; i < this.disabledDays.length; i++) {  
                if (day === this.disabledDays[i]) {  
                    errors.push(this.disabledDaysText);  
                    break;  
                }  
            }  
        }  
  
        var fvalue = this.formatDate(value);  
        if (this.disabledDatesRE && this.disabledDatesRE.test(fvalue)) {  
            errors.push(String.format(this.disabledDatesText, fvalue));  
        }  
  
        return errors;  
    }  
});  
  
Ext.ux.DateTimeMenu = Ext.extend(Ext.menu.DateMenu, {  
    initComponent : function(){  
        this.on('beforeshow', this.onBeforeShow, this);  
        if(this.strict = (Ext.isIE7 && Ext.isStrict)){  
            this.on('show', this.onShow, this, {single: true, delay: 20});  
        }  
        Ext.apply(this, {  
            plain: true,  
            showSeparator: false,  
            items: this.picker = new Ext.ux.DateTimePicker(Ext.applyIf({  
                internalRender: this.strict || !Ext.isIE,  
                ctCls: 'x-menu-date-item',  
                id: this.pickerId,  
                showToday:true  
            }, this.initialConfig))  
        });  
        this.picker.purgeListeners();  
        Ext.menu.DateMenu.superclass.initComponent.call(this);  
  
        /** 
         * @event select 
         * Fires when a date is selected from the {@link #picker Ext.DatePicker} 
         * @param {DatePicker} picker The {@link #picker Ext.DatePicker} 
         * @param {Date} date The selected date 
         */  
        this.relayEvents(this.picker, ['select']);  
        this.on('show', this.picker.focus, this.picker);  
        this.on('select', this.menuHide, this);  
        if(this.handler){  
            this.on('select', this.handler, this.scope || this);  
        }  
    },  
    onRender:function(){  
        Ext.ux.DateTimeMenu.superclass.onRender.apply(this, arguments);  
        if (Ext.isIE) {
            this.el.dom.style.height = "280px";
			this.el.child('ul.x-menu-list').dom.style.height = "280px";
        }  
    }  
});  
  
Ext.ux.DateTimePicker = Ext.extend(Ext.DatePicker, {  
    setValue : function(value){  
        this.value = value;  
        this.update(this.value);  
    },  
    initComponent : function(){  
        Ext.DatePicker.superclass.initComponent.call(this);  
  
        this.hourEl = document.createElement("SELECT");  
                this.minuteEl = document.createElement("SELECT");  
                this.secondEl = document.createElement("SELECT");  
                  
                this.hourEl.style.visibility="visible";  
                this.minuteEl.style.visibility="visible";  
                this.secondEl.style.visibility="visible";  
  
        this.value = this.value ? this.value : new Date();  
  
        this.addEvents(  
            /** 
             * @event select 
             * Fires when a date is selected 
             * @param {DatePicker} this DatePicker 
             * @param {Date} date The selected date 
             */  
            'select'  
        );  
  
        if(this.handler){  
            this.on('select', this.handler,  this.scope || this);  
        }  
  
        this.initDisabledDays();  
    },  
    handleDateClick : function(e, t){  
        e.stopEvent();  
        if(!this.disabled && t.dateValue && !Ext.fly(t.parentNode).hasClass('x-date-disabled')){  
            this.cancelFocus = this.focusOnSelect === false;  
            var dt = new Date(t.dateValue);
            dt.setHours(this.hourEl.options[this.hourEl.selectedIndex].value);  
            dt.setMinutes(this.minuteEl.options[this.minuteEl.selectedIndex].value);  
            dt.setSeconds(this.secondEl.options[this.secondEl.selectedIndex].value);  
            this.setValue(dt);  
            delete this.cancelFocus;  
            this.fireEvent('select', this, this.value);  
        }  
    },  
    selectToday : function(){  
        this.value.setHours(this.hourEl.options[this.hourEl.selectedIndex].value);  
        this.value.setMinutes(this.minuteEl.options[this.minuteEl.selectedIndex].value);  
        this.value.setSeconds(this.secondEl.options[this.secondEl.selectedIndex].value);  
        this.fireEvent('select', this, this.value);  
    },  
    update : function(date, forceRefresh){  
        if(this.rendered){  
            if (this.el && this.activeDate) {  
                this.hourEl.options[date.getHours()].selected=true;  
                this.minuteEl.options[date.getMinutes()].selected=true;  
                this.secondEl.options[date.getSeconds()].selected=true;  
            }  
              
            var vd = this.activeDate, vis = this.isVisible();  
            this.activeDate = date;  
            if(!forceRefresh && vd && this.el){  
                var t = date.clearTime(true).getTime();  
                if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){  
                    this.cells.removeClass('x-date-selected');  
                    this.cells.each(function(c){  
                       if(c.dom.firstChild.dateValue == t){  
                           c.addClass('x-date-selected');  
                           if(vis && !this.cancelFocus){  
                               Ext.fly(c.dom.firstChild).focus(50);  
                           }  
                           return false;  
                       }  
                    }, this);  
                    return;  
                }  
            }  
            var days = date.getDaysInMonth(),  
                firstOfMonth = date.getFirstDateOfMonth(),  
                startingPos = firstOfMonth.getDay()-this.startDay;  
  
            if(startingPos < 0){  
                startingPos += 7;  
            }  
            days += startingPos;  
  
            var pm = date.add('mo', -1),  
                prevStart = pm.getDaysInMonth()-startingPos,  
                cells = this.cells.elements,  
                textEls = this.textNodes,  
                // convert everything to numbers so it's fast  
                d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart, this.initHour)),  
                today = new Date().clearTime().getTime(),  
                sel = date.clearTime(true).getTime(),  
                min = this.minDate ? this.minDate : Number.NEGATIVE_INFINITY,  
                max = this.maxDate ? this.maxDate : Number.POSITIVE_INFINITY,  
                ddMatch = this.disabledDatesRE,  
                ddText = this.disabledDatesText,  
                ddays = this.disabledDays ? this.disabledDays.join('') : false,  
                ddaysText = this.disabledDaysText,  
                format = this.format;  
  
            if(this.showToday){  
                var td = new Date(),  
                    disable = ((ddMatch && format && ddMatch.test(td.dateFormat(format))) ||  
                    (ddays && ddays.indexOf(td.getDay()) != -1));  
  
                if(!this.disabled){  
                    this.todayBtn.setDisabled(disable);  
                    this.todayKeyListener[disable ? 'disable' : 'enable']();  
                }  
            }  
  
            var setCellClass = function(cal, cell){  
                cell.title = '';  
                var t = d.clearTime().getTime();  
                cell.firstChild.dateValue = t;  
                if(t == today){  
                    cell.className += ' x-date-today';  
                    cell.title = cal.todayText;  
                }  
                if(t == sel){  
                    cell.className += ' x-date-selected';  
                    if(vis){  
                        Ext.fly(cell.firstChild).focus(50);  
                    }  
                }  
                // disabling  
                if(t < min) {  
                    cell.className = ' x-date-disabled';  
                    cell.title = cal.minText;  
                    return;  
                }  
                if(t > max) {  
                    cell.className = ' x-date-disabled';  
                    cell.title = cal.maxText;  
                    return;  
                }  
                if(ddays){  
                    if(ddays.indexOf(d.getDay()) != -1){  
                        cell.title = ddaysText;  
                        cell.className = ' x-date-disabled';  
                    }  
                }  
                if(ddMatch && format){  
                    var fvalue = d.dateFormat(format);  
                    if(ddMatch.test(fvalue)){  
                        cell.title = ddText.replace('%0', fvalue);  
                        cell.className = ' x-date-disabled';  
                    }  
                }  
            };  
  
            var i = 0;  
            for(; i < startingPos; i++) {  
                textEls[i].innerHTML = (++prevStart);  
                d.setDate(d.getDate()+1);  
                cells[i].className = 'x-date-prevday';  
                setCellClass(this, cells[i]);  
            }  
            for(; i < days; i++){  
                var intDay = i - startingPos + 1;  
                textEls[i].innerHTML = (intDay);  
                d.setDate(d.getDate()+1);  
                cells[i].className = 'x-date-active';  
                setCellClass(this, cells[i]);  
            }  
            var extraDays = 0;  
            for(; i < 42; i++) {  
                 textEls[i].innerHTML = (++extraDays);  
                 d.setDate(d.getDate()+1);  
                 cells[i].className = 'x-date-nextday';  
                 setCellClass(this, cells[i]);  
            }  
  
            this.mbtn.setText(this.monthNames[date.getMonth()] + ' ' + date.getFullYear());  
  
            if(!this.internalRender){  
                var main = this.el.dom.firstChild,  
                    w = main.offsetWidth;  
                this.el.setWidth(w + this.el.getBorderWidth('lr'));  
                Ext.fly(main).setWidth(w);  
                this.internalRender = true;  
                // opera does not respect the auto grow header center column  
                // then, after it gets a width opera refuses to recalculate  
                // without a second pass  
                if(Ext.isOpera && !this.secondPass){  
                    main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + 'px';  
                    this.secondPass = true;  
                    this.update.defer(10, this, [date]);  
                }  
            }  
        }  
    },  
    onRender:function(container, position){  
        Ext.ux.DateTimePicker.superclass.onRender.apply(this, arguments);  
        //重置按钮文本  
        this.todayBtn.setText(this.okText);  
        this.todayBtn.setTooltip('');  
          
        //设置时、分、秒下拉框  
        var row = document.createElement('tr');  
        var td = document.createElement('td');  
        td.colSpan="7";  
        td.align="center";  
        var hmTb = document.createElement('table');  
        var hmBody = document.createElement('tbody');  
        var hmTr = document.createElement('tr');  
          
        var hmHoursTd = document.createElement('td');  
        hmHoursTd.className = "x-date-hour";  
          
        hmHoursTd.appendChild(this.hourEl);  
        for(var i=0;i<24;i++){  
            var houroption = document.createElement("OPTION");  
            houroption.value=i;  
            houroption.text=i;  
            this.hourEl.options.add(houroption);  
        }  
        this.hourEl.options[this.value.getHours()].selected=true;  
          
        hmTr.appendChild(hmHoursTd);  
          
        var hmSepTd = document.createElement('td');  
        hmSepTd.appendChild(document.createTextNode(":"));  
        hmTr.appendChild(hmSepTd);  
          
        var hmMinuteTd = document.createElement('td');  
        hmMinuteTd.className = "x-date-minute";  
        hmMinuteTd.appendChild(this.minuteEl);  
        for(var i=0;i<60;i++){  
            var minuteOption = document.createElement("OPTION");  
            minuteOption.value=i;  
            minuteOption.text=i;  
            this.minuteEl.options.add(minuteOption);  
        }  
        this.minuteEl.options[this.value.getMinutes()].selected=true;  
      
        hmTr.appendChild(hmMinuteTd);  
          
        hmSepTd = document.createElement('td');  
        hmSepTd.appendChild(document.createTextNode(":"));  
        hmTr.appendChild(hmSepTd);  
          
        var hmSecondTd = document.createElement('td');  
        hmSecondTd.className = "x-date-second";  
        hmSecondTd.appendChild(this.secondEl);  
        for(var i=0;i<60;i++){  
            var minuteOption = document.createElement("OPTION");  
            minuteOption.value=i;  
            minuteOption.text=i;  
            this.secondEl.options.add(minuteOption);  
        }  
        this.secondEl.options[this.value.getSeconds()].selected=true;  
      
        hmTr.appendChild(hmSecondTd);  
          
        hmBody.appendChild(hmTr);  
        hmTb.appendChild(hmBody);  
          
        td.appendChild(hmTb);  
        row.appendChild(td);  
          
        //添加至确定按钮之前  
        this.el.dom.firstChild.firstChild.insertBefore(row, this.el.dom.firstChild.firstChild.lastChild);  
    }  
});  
  
Ext.reg('datetimefield', Ext.ux.DateTimeField);  