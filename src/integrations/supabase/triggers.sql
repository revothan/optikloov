
-- Drop existing function and trigger first
DROP TRIGGER IF EXISTS update_pic_sales_on_payment_deletion ON payments;
DROP FUNCTION IF EXISTS handle_payment_deletion();

-- Create enhanced function with logging
CREATE OR REPLACE FUNCTION handle_payment_deletion()
RETURNS TRIGGER AS $$
DECLARE
    invoice_record RECORD;
    remaining_payments INTEGER;
BEGIN
    -- Get the invoice details for the deleted payment
    SELECT 
        acknowledged_by,
        sale_date,
        branch
    INTO invoice_record
    FROM invoices
    WHERE id = OLD.invoice_id;
    
    -- Get count of remaining payments for this invoice
    SELECT COUNT(*) 
    INTO remaining_payments
    FROM payments 
    WHERE invoice_id = OLD.invoice_id 
    AND id != OLD.id;  -- Exclude the payment being deleted
    
    -- Only proceed if we have an acknowledged_by value
    IF invoice_record.acknowledged_by IS NOT NULL THEN
        -- Update the pic_sales record
        UPDATE pic_sales
        SET 
            sale_amount = GREATEST(0, sale_amount - OLD.amount),
            invoice_count = CASE 
                WHEN remaining_payments = 0 THEN GREATEST(0, invoice_count - 1)
                ELSE invoice_count
            END,
            updated_at = NOW()
        WHERE 
            pic_name = invoice_record.acknowledged_by
            AND month = EXTRACT(MONTH FROM invoice_record.sale_date)
            AND year = EXTRACT(YEAR FROM invoice_record.sale_date)
            AND branch = invoice_record.branch;
            
        -- Remove the record if both sale_amount and invoice_count become 0
        DELETE FROM pic_sales
        WHERE 
            pic_name = invoice_record.acknowledged_by
            AND month = EXTRACT(MONTH FROM invoice_record.sale_date)
            AND year = EXTRACT(YEAR FROM invoice_record.sale_date)
            AND branch = invoice_record.branch
            AND sale_amount <= 0
            AND invoice_count <= 0;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER update_pic_sales_on_payment_deletion
    BEFORE DELETE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION handle_payment_deletion();

-- Ensure the trigger is enabled
ALTER TABLE payments ENABLE TRIGGER update_pic_sales_on_payment_deletion;
