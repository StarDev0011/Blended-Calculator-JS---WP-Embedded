jQuery(document).ready(function ($) {
    // Define a function to calculate total account value and total expense ratio.
    function Calc_Internal_Expense() {
        var total_account_val = parseFloat(0);
        var total_internal_expense = 0;
        var total_expense_ratio = parseFloat(0)
        var bps_total_internal_expense = parseFloat(0)
        // Get the account value and expense ratio of each user and calculate
        $( ".blended_expense" ).each(function() {
            var acc_val = ($(this).attr("class").indexOf("active") == -1) ? 0 : parseFloat($(this).find("#total_account_val").val());
            var internal_expense_val = ($(this).attr("class").indexOf("active") == -1) ? 0 : Math.round(parseFloat($(this).find("#internal_expense").val()) * 10000);
            total_account_val = total_account_val + acc_val
            total_internal_expense = (total_internal_expense + (acc_val * internal_expense_val) / 10000)
        })
        total_expense_ratio = Math.round(total_internal_expense / total_account_val * 10000) / 100
        bps_total_internal_expense = total_internal_expense * 100 / total_account_val
        // Show total account value
        $("#account_values").val(total_account_val)
        // Show total expense ratio
        if($(".switch input").is(":checked")) {
            (isNaN(bps_total_internal_expense)) ? $("#total_internal_expense").val(0) : $("#total_internal_expense").val(bps_total_internal_expense + "BPS");
        }
        else {
            (isNaN(total_internal_expense)) ? $("#total_internal_expense").val(0) : $("#total_internal_expense").val(total_expense_ratio + "%");
        }
    }
    var internal_expense = 0;
    $( ".blended_expense" ).each(function() {
        // Show the corresponding submodel when the main model select box is changed.
        // Get the correct expanse data and save it to the hidden field. And then calculate the total valuse using every hidden fields.
        $(this).find("#program_and_model").on( "change", function() {
            // get the "submodel" attribute value and check if the selected model has submodels or not
            var sub_model = $(this).closest(".program_and_model").find("#program_and_model option:selected").attr("submodel")
            // if it doesn't have submodels hide all submodel select boxes and taxable select box
            if(sub_model == "false"){
                $(this).closest(".program_and_model").find(".sub_model").hide()
                $(this).closest(".program_and_model").find(".taxable_select").hide()
                // if the selected model is "private" show the manual input field and set the filled value to the expense.
                if($(this).val() == "private") {
                    $(this).closest(".blended_expense_calculator_fields").find(".private_expense").show()
                    internal_expense = parseFloat($(this).closest(".blended_expense_calculator_fields").find("#private_expense").val()) / 10000
                }
                // if it's not "private" then set the selected model's value to the expense. Hide the private expense editor.
                else {
                    $(this).closest(".blended_expense_calculator_fields").find(".private_expense").hide()
                    internal_expense = $(this).val()
                }                
            }
            // If it has submodels then show the corresponding submodel only. 
            else {
                // Hide the private expense editor.
                $(this).closest(".blended_expense_calculator_fields").find(".private_expense").hide()
                var model_num = $(this).val()
                $(this).closest(".program_and_model").find(".sub_model").show()
                // compare the selected main model's value with the name attribute of each submodel select box
                $(this).closest(".program_and_model").find(".sub_model select").each(function() {
                    $(this).removeClass("active_model")
                    let num = $(this).attr("name")
                    let taxable = $(this).attr("taxable")
                    // if it's the same show only that submodel by adding a class "active_model"
                    if(num == model_num) {
                        $(this).show()
                        $(this).addClass("active_model")
                        // If the selected main model is taxable show the taxable select box.
                        if(taxable == "true"){
                            $(this).closest(".program_and_model").find(".taxable_select").show()
                            // Set the taxable selct box's data to expense
                            var tax_option = $(this).closest(".program_and_model").find(".taxable_select select").val()
                            internal_expense = $(".sub_model").find("[name='" + num + "']").find(":selected").attr(tax_option)
                        }
                        // Else, hide the taxable select box and set the selected submodel's value to the expense
                        else {
                            internal_expense = $(this).val()
                            $(this).closest(".program_and_model").find(".taxable_select").hide()
                        }
                    }
                    // If the selected main model's value and the name attribute of the submodel select box are not the same, hide the submodel select box
                    else {
                        $(this).hide()
                    }
                })
            }
            // Save the correct expense to the hidden field.
            $(this).closest(".blended_expense_calculator_fields").find("#internal_expense").val(internal_expense)
            // Calculate the total account value and the expense ratio.
            Calc_Internal_Expense()
        });
        // Get new expense value when the submodel is changed. And calculate the total account value and expense ratio.
        $(this).find(".sub_model select").each(function() {
            let taxable = $(this).attr("taxable")
            $(this).on("change", function() {
                // If the main model is taxable check what is selected and get the corresponding value
                if(taxable == "true"){
                    var tax_option = $(this).closest(".program_and_model").find(".taxable_select select").val()
                    internal_expense = $(this).closest(".sub_model").find(".active_model").find(":selected").attr(tax_option)
                    $(this).closest(".blended_expense_calculator_fields").find("#internal_expense").val(internal_expense)
                }
                else {
                    internal_expense = $(this).val()
                    $(this).closest(".blended_expense_calculator_fields").find("#internal_expense").val(internal_expense)
                }
                Calc_Internal_Expense()
            })
        })

        // Get new expanse value when the taxable select box is changed. And calculate the total account value and expense ratio.
        $(this).find(".taxable_select select").on("change", function() {
            var tax_option = $(this).val()
            internal_expense = $(this).closest(".program_and_model").find(".sub_model select.active_model").find(":selected").attr(tax_option)
            $(this).closest(".blended_expense_calculator_fields").find("#internal_expense").val(internal_expense)
            Calc_Internal_Expense()
        })

        // Calculate the total account value and expense ratio when the account value is changed.
        $(this).find("#total_account_val").each(function() {
            $(this).change(function() {
                Calc_Internal_Expense()
            })
        })

        // Calculate the total account value and expense ratio when the private expense input is changed.
        $(this).find("#private_expense").each(function() {
            $(this).change(function() {
                var private_val = parseFloat($(this).val()) / 10000
                $(this).closest(".blended_expense_calculator_fields").find("#internal_expense").val(private_val)
                Calc_Internal_Expense()
            })
        })
    })

    $("#number_accounts").on("change", function() {
        Calc_Internal_Expense()
    })

    // Switch BPS and % value
    $(".switch input").change(function() {
        if(this.checked) {
            var bps = parseFloat($("#total_internal_expense").val().split("%")) * 100 + "BPS"
            $("#total_internal_expense").val(bps)
        }
        else {
            var percent = parseFloat($("#total_internal_expense").val().split("BPS")) / 100 + "%"
            $("#total_internal_expense").val(percent)
        }
    })
});