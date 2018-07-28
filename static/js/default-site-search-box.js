$(function () {
    $('.select-box')
        .setSelect({
            optionList: eval($('#sitelist').val()),
            hiddenInput: '#siteid',
            getOption: '#sOptionBtn',
            callback: function (option) {}
        });
});
(function ($) {
    $.fn.setSelect = function (options) {
        var opt = $.extend({
                optionList: [],
                getOption: '',
                hiddenInput: '',
                callback: function () {}
            },
            options || {});
        return this.each(function () {
            opt._id = this;
            var _time;
            var arrow = $(this).find('i');

            var defaultvalue = parseInt($(opt.hiddenInput).val());
            var defaultoption;
            $.each(opt.optionList,
                function (index, item) {
                    if (defaultvalue === item.Value) {
                        defaultoption = item.Name;
                        return false;
                    }
                });
            $(opt.getOption).text(defaultoption);

            $(opt._id).append('<ul id="selectList"></ul>');

            $.each(opt.optionList,
                function (index, item) {
                    $("#selectList").append('<li data-value="' + item.Value + '">' + item.Name + '</li>');
                });

            $(opt._id)
                .bind({
                    click: function () {
                        $(arrow).addClass('arrow-hover');
                        $('#selectList').slideDown();
                        //  clearTimeout(_time);
                        return false;
                    }
                    //,
                    //mouseleave: function () {
                    //    _time = setTimeout(function () {
                    //        $(arrow).removeClass('arrow-hover');
                    //        $('#selectList').slideUp();
                    //    }, 300);
                    //}
                });
            //获取选择的值
            $('#selectList')
                .delegate('li',
                    'click',
                    function () {
                        var option = $(this).text();
                        var value = $(this).data('value');
                        $(opt.getOption).text(option);
                        $(opt.hiddenInput).val(value);
                        $('#selectList').slideUp();
                        $(arrow).removeClass('arrow-hover');
                        opt.callback(option);
                        return false;
                    });

            $(document)
                .on('click',
                    function () {
                        $('#selectList').slideUp();
                        $(arrow).removeClass('arrow-hover');
                    });
        });
    };
})(jQuery);