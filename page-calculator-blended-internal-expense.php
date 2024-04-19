<?php
/**
 * Template Name: Blended Internal Expense Calculator
 * 
 * @package WordPress
 */
get_header();
global $post;
?>
<?php
/* Get the current page ID and get custom fileds data using the ID. As I wrote, all models are custom fields*/
?>
<?php 
$id =  $post->ID;
$program_and_models = get_field( "program_and_model", $id );
?>
<div class="calculator section-inner">
    <h2><?php the_title(); ?></h2>
    <div class="calculator_body">
        <!-- This is a select box to choose how many accounts to calculate. -->
        <label for="number_accounts">How Many Accounts are you Calculating?</label>
        <select name="number_accounts" id="number_accounts">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
        </select>
        <?php
        for ($i=1; $i < 6 ; $i++) { ?>
            <div class="blended_expense account_<?php echo $i;?> <?php if($i == 1) { echo 'active'; } else { echo 'hidden'; } ?>">
                <h3>Account <?php echo $i; ?></h3>
                <div class="blended_expense_calculator_fields">
                    <!-- Account Name Input Field -->
                    <div class="account_name">
                        <label for="account_name">Account <?php echo $i; ?> Name</label>
                        <input id="account_name" name="account_name" type="text" >
                    </div>
                    <!-- Account Value Input Field -->
                    <div class="total_account_val">
                        <label for="total_account_val">Account <?php echo $i; ?> Value</label>
                        <input name="total_account_val" id="total_account_val" type="number" value="0" pi="" >
                    </div>
                    <!-- Model Select Box -->
                    <div class="program_and_model">
                        <label for="program_and_model">Account <?php echo $i; ?> Program and Model</label>
                        <!-- The main model -->
                        <select name="program_and_model" id="program_and_model">
                            <option value="-1" >Please Select</option>
                            <?php foreach ($program_and_models as $key => $program_and_model) {
                                $label = $program_and_model['label'];
                                /* Get has_submodel custom field and model_expense fiels.
                                has_submodel_field is to check if the main model has submodel.
                                model_expense field is the expense value of the main model if it doesn't have sub_models. */
                                $has_submodel = $program_and_model['has_submodel'];
                                $model_expense = $program_and_model['model_expense'];
                                ?>
                                <!-- Set the key to option value. -->
                                <!-- add a new attribute "submodel" for submodel to each option. If the has_submodel value is false then set the attribute data to false -->
                                <option value="<?php if($has_submodel) { echo $key; } else { echo $model_expense; } ?>" <?php if(!$has_submodel) {echo "submodel='false'";} ?>><?php echo $label; ?></option>
                            <?php
                            }
                            ?>
                        </select>
                        <!-- Submodel Select Box -->
                        <div class="sub_model">                        
                            <?php foreach ($program_and_models as $key => $program_and_model) {
                                $label = $program_and_model['label'];
                                /* Get taxable custom field. It's to check if the main model has taxable and munipal.*/
                                $taxable = $program_and_model['taxable'];
                                $has_submodel = $program_and_model['has_submodel'];
                                $model_expense = $program_and_model['model_expense'];
                                /* Get risk_tolerances. It's an array of submodels */
                                $risk_tolerances = $program_and_model['risk_tolerance'];?>
                                <?php if($has_submodel): ?>
                                <!-- Add an attribut "name" to match the main model. So the submodel is belong to the main model whose key is equal to the submodel's name. -->
                                <!-- Add a new attribute "taxable". If the taxable value is true then set the attribute data to true too. -->
                                <select name="<?php echo $key; ?>" <?php if($taxable) {echo "taxable='true'";} ?>>
                                <?php
                                foreach($risk_tolerances as $risk_tolerance){?>
                                <!-- Set the option value to expense data. If the taxable is true add both taxable value and municipal value as attributes. -->
                                    <option value="<?php echo $risk_tolerance['expense_ratio']; ?>" <?php if($taxable) {echo "municipal_ratio=". $risk_tolerance['municipal_ratio']; echo " taxable_ratio=". $risk_tolerance['taxable_ratio'];}?>><?php echo $risk_tolerance['risk']; ?></option>
                                <?php
                                }
                                ?>
                                </select>
                            <?php endif;
                            }
                            ?>
                        </div>
                        <!-- Taxable Select Box -->
                        <div class="taxable_select">
                            <select>
                                <option value="taxable_ratio" test="test">Taxable</option>
                                <option value="municipal_ratio">Municipal</option>
                            </select>
                        </div>
                    </div>
                    <!-- Private Expense Input Field -->
                    <div class="private_expense">
                        <label for="private_expense">Account <?php echo $i; ?> PCS Internal Expense</label>
                        <input type="text" id="private_expense" value="0">
                    </div>
                    <!-- Final Expense Ratio Field. This is a hidden field. This is for an easy calculation. -->
                    <div class="internal_expense">
                        <input type = "text" id="internal_expense" value=0>
                    </div>
                </div>
            </div>
        <?php
        }
        ?>
        <div class="calculations">
            <h3>Total</h3>
            <!-- BPS/% Switch -->
            <div class="bps">
                <p>Show BPS?</p>
                <label class="switch">
                    <input type="checkbox">
                    <span class="slider round"></span>
                </label>
            </div> 
            <div class="total">
                <!-- Total Account Value -->
                <div class="account_values">
                    <label for="account_values">Account Values ($)</label>
                    <input type = "text" id = "account_values" readonly>
                </div>
                <!-- Total Expense Ratio -->
                <div class="total_internal_expense">
                    <label for="total_internal_expense">Internal Expense (BPS)</label>
                    <input type = "text" id = "total_internal_expense" readonly>
                </div>
            </div>
        </div>
    </div>
</div>
<?php get_footer();