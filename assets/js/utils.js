var utils = utils || (function () {
    var ctor = function () { }

    // like c# string.format.
    ctor.stringFormat = function (text) {
        if (arguments.length <= 1) return text;
        for (var i = 0; i <= arguments.length - 2; i++)
            text = text.replace(new RegExp("\\{" + i + "\\}", "gi"), arguments[i + 1]);
        return text;
    };

    // $.ajax wrapper.
    // ex : utils.ajaxCall("POST", "@Url.Content("~/AuthenticateService/FindPassword")", obj, "N", sf);
    ctor.ajaxCall = function (csrf_token, method, url, prm, showYn, successcallback, errorcallback, completecallback, SystemLogValue1, SystemLogValue2) {
        if (typeof (jQuery) == typeof (undefined)) { alert("jquery library is undefined.."); return; }

        try {
            $.ajax({
                type: method,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                data: JSON.stringify(prm),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrf_token);

                    //-- 진행중...
                    // if (showYn == "Y" && typeof (App) != typeof (undefined)) {
                    //     App.blockUI({
                    //         boxed: true,
                    //         message: "진행 중 ...",
                    //         overlayColor: "black"
                    //     });
                    // }                        
                },
                success: function (data) {
                     successcallback(data); 
                    },
                complete: function () {
                    if (typeof (completecallback) != typeof (undefined))
                        completecallback();

                    //-- 진행중...
                    // if (showYn == "Y" && typeof (App) != typeof (undefined))
                    //     App.unblockUI();
                },
                error: function (xhr, status, error) {

                    if (typeof (errorcallback) != typeof (undefined))
                        errorcallback(xhr, status, error);

                    console.log(error);    
                    // save system log
                    // utils.SaveSystemLog(this.type, this.url, xhr.responseText, status, error, "[Error]", true);
                }
            });

            // save system log
            // utils.SaveSystemLog(method, url, prm, "CallAjax", "", "", false);

        } catch (e) {
            alert("error : " + e.Message);
        }
    };

    /**
     * Wrapper around `console.log` (when available)
     * @param {*} [values] Values to log
     */
    ctor.log = function () { };
    if (typeof console !== 'undefined') {
        if (typeof console['log'] !== 'undefined' &&
            typeof console['log'].apply === 'function') {
            ctor.log = function () {
                return console['log'].apply(console, arguments);
            };
        }
    };

    // carriage return.
    ctor.carriageReturn = function (t) {
        if (t != null) {
            return t.replace(/\n/g, "<br/>").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
        } else {
            return "";
        }
    };

    // redirection post method.
    ctor.redirectByPost = function (url, tgt, prm) {
        var $form = $("<form/>").attr({ method: "post", action: url, target: tgt });
        $.each(prm, function (key, val) {
            var $hidden = $("<input/>");
            $hidden.attr("type", "hidden");
            $hidden.attr("name", key);
            $hidden.attr("value", val);
            $form.append($hidden);
        });
        $("body").append($form);
        $form.submit();
    };

    // padding zero string.
    ctor.toPadZeroString = function (val, len) {
        var ret = val.toString();
        if (ret.length > 0 && !isNaN(val))
            ret = ret.length >= len ? ret : new Array(len - ret.length + 1).join('0') + ret;
        return ret;
    };

    // currency display.
    ctor.currencyFormat = function (num) {
        var p = num.toFixed(2).split(".");
        return "" + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
            return num + (i && !(i % 3) ? "," : "") + acc;
        }, "");
    };

    ctor.isValidDate = function (date) {
        if (typeof (date) == "undefined") return false;
        return date && (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    }

    ctor.getDate14 = function (date) {
        if (!ctor.isValidDate(date)) { return ""; }
        var dt = new Date(date);
        return ctor.stringFormat("{0}{1}{2}{3}{4}{5}", dt.getFullYear().toString(), ctor.toPadZeroString(dt.getMonth() + 1, 2), ctor.toPadZeroString(dt.getDate(), 2), ctor.toPadZeroString(dt.getHours(), 2), ctor.toPadZeroString(dt.getMinutes(), 2), ctor.toPadZeroString(dt.getSeconds(), 2));
    };

    // like c# DateTime.Now.ToString("yyyyMMddHHmmss")
    ctor.getNowDate14 = function () {
        var dt = new Date();
        return ctor.stringFormat("{0}{1}{2}{3}{4}{5}", dt.getFullYear().toString(), ctor.toPadZeroString(dt.getMonth() + 1, 2), ctor.toPadZeroString(dt.getDate(), 2), ctor.toPadZeroString(dt.getHours(), 2), ctor.toPadZeroString(dt.getMinutes(), 2), ctor.toPadZeroString(dt.getSeconds(), 2));
    };

    // return javascript object array max value.
    ctor.getArryMaxValue = function (json, icol) {
        if (typeof (json) == typeof (undefined) || json == null || json.length == 0) {
            return 0;
        } else {
            return $.map(json, function (o, i) { return o[icol]; }).reduce(function (a, b) { return Math.max(a, b); });
        }
    };

    // return javascript object array min value.
    ctor.getArryMinValue = function (json, icol) {
        if (typeof (json) == typeof (undefined) || json == null || json.length == 0) {
            return 0;
        } else {
            return $.map(json, function (o, i) { return o[icol]; }).reduce(function (a, b) { return Math.min(a, b); });
        }
    };

    //-------------------------------------------------------------------------------------------------
    // 오늘 부터 offset만큼의 날자 얻기
    //-------------------------------------------------------------------------------------------------
    ctor.GetOffsetDayString = function (offset, seprator) {

        var now = new Date();
        now.setDate(now.getDate() + offset);
        var m = now.getMonth() + 1;
        var d = now.getDate();
        var y = now.getFullYear();
        var offsetDay = y + seprator +
            (m < 10 ? '0' : '') + m + seprator +
            (d < 10 ? '0' : '') + d;

        return offsetDay;
    };

    //-------------------------------------------------------------------------------------------------
    // 주어진 날자 부터 offset만큼의 날자 얻기
    // dt : Date
    //-------------------------------------------------------------------------------------------------
    ctor.GetOffsetDayStringEx = function (dt, offset, seprator) {

        var tmpDt = new Date(dt.valueOf());
        tmpDt.setDate(dt.getDate() + offset);
        var m = tmpDt.getMonth() + 1;
        var d = tmpDt.getDate();
        var y = tmpDt.getFullYear();
        var offsetDay = y + seprator +
            (m < 10 ? '0' : '') + m + seprator +
            (d < 10 ? '0' : '') + d;

        return offsetDay;
    };

    //-------------------------------------------------------------------------------------------------
    // Summary : 오늘 날자 얻기
    // isDemoStatic : 데모용 통계 날자를 적용 할 것인가?
    // Param : 리턴되는 날자의 구분자.
    // Return : ex ) 2018.02.23
    //-------------------------------------------------------------------------------------------------
    // Added by hopan - 2018/2/14-16h3m7s
    //-------------------------------------------------------------------------------------------------
    ctor.GetCurDayString = function (sperator, isDemoStatic) {

        var output = "";

        var IsGetReal = true;
        if ((typeof (isDemoStatic) != typeof (undefined)) || isDemoStatic != null || isDemoStatic == true) {
            if (g_wcms.global["DemoStatisticDate"] != "")
                IsGetReal = false;
        }

        if (IsGetReal) {
            var d = new Date();

            var month = d.getMonth() + 1;
            var day = d.getDate();

            output = d.getFullYear() + sperator +
                (month < 10 ? '0' : '') + month + sperator +
                (day < 10 ? '0' : '') + day;
        }
        else {
            var tmpBuf = g_wcms.global["DemoStatisticDate"].split('.');
            output = tmpBuf[0] + sperator + tmpBuf[1] + sperator + tmpBuf[2];
        }

        return output;
    };

    ctor.GetDays = function () {
        var d = new Date();
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return days[d.getDay()];
    };

    ctor.GetTimes = function () {
        var d = new Date();

        return d.getHours() + ":" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    };

    ctor.GetDayString = function (date, sperator, isDemoStatic, iDemoStaticOffset) {

        var output = "";

        var IsGetReal = true;
        if ((typeof (isDemoStatic) != typeof (undefined)) || isDemoStatic != null || isDemoStatic == true) {
            if (g_wcms.global["DemoStatisticDate"] != "")
                IsGetReal = false;
        }

        if (IsGetReal) {
            var d = date || new Date();

            var month = d.getMonth() + 1;
            var day = d.getDate();

            var output = d.getFullYear() + sperator +
                (month < 10 ? '0' : '') + month + sperator +
                (day < 10 ? '0' : '') + day;
        }
        else {
            if (typeof (iDemoStaticOffset) == typeof (undefined)) {
                var tmpBuf = g_wcms.global["DemoStatisticDate"].split('.');
                output = tmpBuf[0] + sperator + tmpBuf[1] + sperator + tmpBuf[2];
            }
            else {
                var TmpDate = new Date(g_wcms.global["DemoStatisticDate"]);
                output = utils.GetOffsetDayStringEx(TmpDate, iDemoStaticOffset, sperator);
            }
        }

        return output;
    };

    //-------------------------------------------------------------------------------------------------
    // Summary : DB Format날자를 UI용으로 변환
    // Param : ex) 20180308115046 , opt = 0 : 날짜까지, opt = 1 : 시간까지, opt = 2 : 시간만
    // Return : opt = 0 : 2018.03.08, 
    //          opt = 1 : 2018.03.08 11:50
    //          opt = 2 : 11.50 
    //          opt = 3 : 2018.03.08 11:50:12
    //-------------------------------------------------------------------------------------------------
    // Added by hopan - 2018/3/9-9h20m30s
    //-------------------------------------------------------------------------------------------------
    ctor.ConvertDateFormat = function (opt, srcDate, sperator, defaultData) {
        var strRet = "";
        if (defaultData != null)
            strRet = defaultData;

        if (srcDate != null && srcDate != "" && srcDate.length >= 14) {
            switch (opt) {
                case 0:
                    {
                        strRet = utils.stringFormat("{0}{1}{2}{3}{4}", srcDate.substr(0, 4), sperator, srcDate.substr(4, 2), sperator, srcDate.substr(6, 2));
                    }
                    break;

                case 1:
                    {
                        strRet = utils.stringFormat("{0}{1}{2}{3}{4} {5}:{6}", srcDate.substr(0, 4), sperator, srcDate.substr(4, 2), sperator, srcDate.substr(6, 2), srcDate.substr(8, 2), srcDate.substr(10, 2));
                    }
                    break;
                case 2:
                    {
                        strRet = utils.stringFormat("{0}{1}{2}", srcDate.substr(8, 2), sperator, srcDate.substr(10, 2));
                    }
                    break;
                case 3:
                    {
                        strRet = utils.stringFormat("{0}{1}{2}{3}{4} {5}:{6}:{7}", srcDate.substr(0, 4), sperator, srcDate.substr(4, 2), sperator, srcDate.substr(6, 2), srcDate.substr(8, 2), srcDate.substr(10, 2), srcDate.substr(12, 2));
                    }
                    break;
            }
        } else if (srcDate != null && srcDate != "" && srcDate.length == 12) {
            switch (opt) {
                case 0:
                    {
                        strRet = utils.stringFormat("{0}{1}{2}{3}{4}", srcDate.substr(0, 4), sperator, srcDate.substr(4, 2), sperator, srcDate.substr(6, 2));
                    }
                    break;
                case 2:
                    {
                        strRet = utils.stringFormat("{0}{1}{2}", srcDate.substr(8, 2), sperator, srcDate.substr(10, 2));
                    }
                    break;
            }
        } else if (srcDate != null && srcDate != "" && srcDate.length == 8) {
            switch (opt) {
                case 0:
                    {
                        strRet = utils.stringFormat("{0}{1}{2}{3}{4}", srcDate.substr(0, 4), sperator, srcDate.substr(4, 2), sperator, srcDate.substr(6, 2));
                    }
                    break;
            }
        }

        return strRet;
    };

    // 01:01:01 => 1시:1분:1초
    // 00:01:01 => 1분:1초
    ctor.GetMediaTime = function (val) {

        if (typeof (val) != typeof (undefined)) {

            if (val.length == 8) {
                var h = val.substr(0, 2);
                var m = val.substr(3, 2);
                var s = val.substr(6, 2);
                return utils.stringFormat("{0}{1}{2}",
                    h == "00" ? "" : parseInt(h).toString() + "시",
                    m == "00" ? "" : parseInt(m).toString() + "분",
                    //s == "00" ? "" : s + "초"
                    parseInt(s).toString() + "초"
                    );
            }
            else {
                return val;
            }
        }
        return "";
    };


    // 2018.07.11 17:31 => 2018.07.11
    ctor.SubString = function (date, start, end) {
        if (date != null)
            return date.toString().substring(start, end);
    };

    //-------------------------------------------------------------------------------------------------
    // 14자리 스트링 => Date object로 
    //-------------------------------------------------------------------------------------------------
    ctor.ConvertDBTimeToDate = function(val){
        try{
            //var tm = new Date(val.substr(0, 4), val.substr(4, 2), val.substr(6, 2), val.substr(8, 2), val.substr(10, 2), val.substr(12, 2)).toLocaleString('ko-KR', { timeZone: 'UTC' });

            var tmp = parseInt(val.substr(4, 2)) - 1;
            var tm = new Date(val.substr(0, 4), tmp, val.substr(6, 2), val.substr(8, 2), val.substr(10, 2), val.substr(12, 2));

            return tm;
        }
        catch(err)
        {
            return null;
        }
    };

    //-------------------------------------------------------------------------------------------------
    // Get total minutes from Date
    //-------------------------------------------------------------------------------------------------
    ctor.GetTotalMinutesFromDate = function (startDate, endDate) {
        try {

            var diff = Math.abs(endDate - startDate);

            var minutes = Math.floor((diff / 1000) / 60);

            return minutes;
        }
        catch (err) {
            return 0;
        }        
    };

    //////////////////////////////////////////////////////////////////
    //-- string replace
    //////////////////////////////////////////////////////////////////
    ctor.replaceall = function (str, searchStr, replaceStr) {
        return str.split(searchStr).join(replaceStr);
    }

    //////////////////////////////////////////////////////////////////
    //-- check null 값 
    //////////////////////////////////////////////////////////////////
    ctor.checknull = function (value) {
        if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length))
            return false;
        else
            return true;
    }

    ctor.DownloadExcel = function (sheetname, downloadfilename, arrData) {
        var table = document.createElement('table');
        table.innerHTML = '';

        //for (i in arrData) {
        //    table.innerHTML = table.innerHTML + arrData[i];
        //}

        table.innerHTML = arrData.join("<tr></tr>");    //테이블간에 한줄구분

        $(table).table2excel({
            //exclude: excludeclass,
            name: sheetname,
            filename: downloadfilename, //do not include extension
            exclude_img: false,
            exclude_links: false,
            exclude_inputs: false
        });
    }

    // Date 시간이 valid 한지 체크
    ctor.IsValidDate = function (d) {
        return d instanceof Date && !isNaN(d);
    };

    //////////////////////////////////////////////////////////////////////////
    // 숫자 콤마 넣어주기
    ctor.numberWithCommas = function (x, zero) {
        var num = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // 값이 "0" 인 경우, 전달된 zero 값으로 변경, 전달된 값이 없으면 변경없음
        zero = zero || "0";
        num = num == "0" ? zero : num;
        return num;
    };

    ctor.addDays = function (date, daysToAdd) {
        var _24HoursInMilliseconds = 86400000;
        return new Date(date.getTime() + daysToAdd * _24HoursInMilliseconds);
    };

    // open New window
    ctor.OpenNewWindow = function (targetName, url,width, height, htmlParam) {

        var IsOpen = false;
        var param = "scrollbars=yes,resizable=yes,top=200,left=200,width=800,height=600";

        if (typeof (height) != typeof (undefined) && typeof (width) != typeof (undefined)) {
            param = "scrollbars=yes,resizable=yes,top=200,left=200,width="+ width.toString() +",height=" + height.toString();
        }

       // if (filetype == "1" || filetype == "2") {
        var win = window.open(url, targetName, param);
        if (win) IsOpen = true;

        if (IsOpen) {
            if (typeof (htmlParam) != typeof (undefined))
                win.document.body.innerHTML = htmlParam;
        } else {
            utils.alert("알림", '미리보기 창을 띄우려면 브라우저에서 팝업을 허용 해야 합니다.');
        }
        //   }
        /*else if (filetype == "3") {
            var myWindow = window.open("", "_self", param);
            myWindow.document.write("<audio controls='controls'><source src='url' type='audio/mp3' /></audio>");
        }
        else if (filetype == "4") {
        }*/
    };

    ctor.CheckCalendarDate = function (date) {
        if (typeof (date) == "undefined") return false;

        if(typeof(date) != "string")
            return false;

        try
        {
            // IE에서 에러 나서 수정
            //return date && (new Date(date) !== "Invalid Date") && !isNaN(new Date(date)); 

            var tmpList = date.split('.');
            if (tmpList.count < 3)
                return false;

            var tmpD = new Date(tmpList[0], tmpList[1], tmpList[2], 0, 0, 0, 0);
            if (tmpD == "Invalid Date")
                return false;
        }
        catch(ex)
        {
            return false;
        }
        
        return tmpD;
    };


    // 날자 차이 얻기
    ctor.GetDiffDays_Calendar = function (startDate, endDate) {

        if (typeof (startDate) == "undefined") return false;
        if (typeof (endDate) == "undefined") return false;

        var start = utils.CheckCalendarDate(startDate);
        if(start == false){
            return "sError";
        }

        var end = utils.CheckCalendarDate(endDate);
        if(end == false){
            return "eError";
        }

        var diff = new Date(end - start);
        var days  = diff/1000/60/60/24;

        return days; 
    };

    //카렌더의 시작 ~ 끝날자 기간 체크
    ctor.CheckInterval_CalendarDays = function (startDate, endDate, Days) {

        var ret = utils.GetDiffDays_Calendar(startDate, endDate);

        if (ret == "sError") {
            utils.alert("알림", "시작 날자 설정을 정상적으로 해 주세요.");
            return false;
        }

        if (ret == "eError") {
            utils.alert("알림", "종료 날자 설정을 정상적으로 해 주세요.");
            return false;
        }

        if (ret > parseInt(Days)) {
            utils.alert("알림", "시작 ~ 종료일의 간격을" + Days+ "일 이하로 설정 해 주세요.");
            return false;
        }
        
        return true;
    };

    return ctor;
})();

