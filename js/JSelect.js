function JSelect(el, level, params, funcs, customFunc) {

    var _that = this;

    // 元素
    this.el = el;

    // 正在选中项
    this.changeArr = (new Array()).concat(params);

    // 最终选中项
    this.changedArr = (new Array()).concat(params);

    // 通过接口获取数据的异步调用方法 数组
    this.funcArr = funcs;

    // 选择项的级数
    this._level = level;

    // 当前选中的Tab索引，从0开始
    this.tabIndex = 0;

    // 未选中时默认显示的文本
    this.defaultTabText = '请选择';

    // 初始化对象
    this.init = function() {

        // 获取有预设值的数量
        this.loadTabIndex();

        // 设置默认值
        this.setVal();

        var _this = this;
        this.el.click(function() {

            // 创建html
            _this.createHTML();

            // 
            _this.initContent();

            _this.bindEvent();

            _this.initBar();
        })
        customFunc || (customFunc = function() { return level })
    }

    // 设置值
    this.setVal = function() {
        var _str = '';
        this.changedArr = (new Array()).concat(this.changeArr)
        for(var i = 0; i <= this.tabIndex; i++) {
            if(this.changedArr[i] != undefined) {
                _str += this.changedArr[i].name + ' ';
            }
        }
        this.el.val($.trim(_str));
    }

    // 初始化bar
    this.initBar = function() {
        for(var i = 0; i <= this.tabIndex; i++) {
            if(this.changedArr[i] == undefined) {
                this.changedArr[i] = {}
            }
            // if(i == 0) {
            //     $('.selected-address li').eq(i).data('pcode', '');
            // } else {
            //     $('.selected-address li').eq(i).data('pcode', this.changedArr[i-1].code || '');
            // }
            $('.selected-address li').eq(i).data('code', this.changedArr[i].code || '');
            $('.selected-address li').eq(i).text(this.changedArr[i].name || this.defaultTabText);
        }
    }

    // 绑定事件
    this.bindEvent = function() {
        var _this = this;
        $('#addressSelectWrapper').click(function() {
            $(this).remove();
        })

        $('#addressSelect').click(function(e) {
            e.stopPropagation();
        })

        $('.selected-address li').click(function() {
        	_this.tabIndex = $(this).index()
            _this.reset(_this.tabIndex)
            _this.reloadContent(_this.tabIndex, $(this).data('pcode'), $(this).data('code'))
        })
    }

    // 初始化列表
    this.initContent = function() {
        var init_code = 0;
        if(this.changedArr[this.tabIndex-1] != undefined) {
            init_code = this.changedArr[this.tabIndex-1]['code']
        }
        this.funcArr[this.tabIndex](init_code, this.createList);
    }

    // 显示html
    this.createHTML = function() {
        var _tabStr = '', _contentStr = '';
        for(var i = 0; i < this._level; i++) {
            _tabStr += '<li class="lastarea" style="'+ (i < level?'':'display: none;') +'">请选择</li>'
            _contentStr += '<ul></ul>'
        }

        $('body').append('<div id="addressSelectWrapper">\
        <div id="addressSelect">\
            <div class="tip">\
                <h3>所在地区</h3>\
                <button type="button" id="cancel"></button>\
            </div>\
            <div id="address">\
                <ul class="selected-address">' + _tabStr +
                '</ul>\
                <div class="address-content">' + _contentStr +
                '</div>\
            </div>\
        </div>\
    </div>')
            $('#addressSelectWrapper').show();
    }

    // 创建列表
    this.createList = function(index, data) {
        var _this = _that;
        var _str = '';
        for(var i in data) {
            _str += '<li data-code="'+ i +'" class="'+ ($('.selected-address li').eq(index).data('code') == i?'active':'') +'">'+ data[i] +'</li>'
        }
        $('.address-content').show();
        $('.address-content ul').hide();
        $('.address-content ul').eq(index).show();
        $('.address-content ul').eq(index).html(_str);

        $('.address-content ul li').click(function() {
            // debugger
            $(this).addClass('active').siblings().removeClass('active')
            var _index = $(this).parent().index();

            if(_this.changeArr[_index] == undefined) {
                _this.changeArr[_index] = {}
            }
            _this.changeArr[_index].code = $(this).data('code')
            _this.changeArr[_index].name = data[$(this).data('code')]
            // debugger;
            var newLevel = customFunc(_this._level, _index, _this.changeArr);
            
            // 根据自定义的某些条件改变显示的级数
            _this.changeLevel(newLevel);
            $('.selected-address li').eq(_index).text(_this.changeArr[_index].name);
            $('.selected-address li').eq(_index).data('code', $(this).data('code'))
            // $('.selected-address li').eq(_index).data('pcode', _index == 0?'':(_this.changeArr[_index-1].code))
            if(_index == level - 1) 
                _this.destory();
            else
                _this.reloadContent(_this.tabIndex = _index<level?(_index+1):_index, $(this).data('code'));

        })
        $('.selected-address li').eq(index).addClass('active').siblings().removeClass('active')
    }

    this.reloadContent = function(index, pcode, code) {
        $('.selected-address li').eq(index).addClass('active').siblings().removeClass('active')
        console.log('index:'+ index +', pcode:' + pcode +', code:' + code)
        this.funcArr[index](pcode, this.createList)
        
    }

    this.loadTabIndex = function() {
        for(var i = 0; i<this.changedArr.length; i++) {

            if(this.changedArr[i] != undefined) {
                this.tabIndex = i
            }else{
                return
            }
        }
    }

    // 移除
    this.destory = function() {
        this.setVal();
        $('#addressSelectWrapper').remove();
    }

    // 重置请选择
    this.reset = function(index) {
        this.changeArr.length = index + 1
        console.log(this.changeArr)
        console.log(this.changedArr)
        for(var i = index+1; i < level; i++) {
            var _dom = $('.selected-address li').eq(i);
            _dom.text(this.defaultTabText);
            _dom.data('code', '');
            // _dom.data('pcode', '');
        }
    }

    // 改变现实的级数
    this.changeLevel = function(newLevel) {
        level = newLevel;
        console.log('new:', level)
        $('.selected-address li').hide();
        for(var i = 0; i<level; i++) {
           $('.selected-address li').eq(i).show() 
        }
    }
}