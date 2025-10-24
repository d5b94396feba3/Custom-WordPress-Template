<?php
// Register REST API endpoint development
add_action('rest_api_init', function () {
    register_rest_route('fox-api/v1', '/send-search-data', [
        'methods' => 'POST',
        'callback' => 'handle_search_data',
        'permission_callback' => function($request) {
            $nonce = $request->get_header('X-WP-Nonce');
            return wp_verify_nonce($nonce, 'wp_rest');
        }
    ]);
});

function handle_search_data(WP_REST_Request $request) {
    try {
        // Get form data
        $data = $request->get_params();
        $files = $request->get_file_params();

        // Process file upload
        $file_url = null;
        if (!empty($files['survey_file'])) {
            require_once(ABSPATH . 'wp-admin/includes/file.php');
            require_once(ABSPATH . 'wp-admin/includes/image.php');
            
            $upload = wp_handle_upload($files['survey_file'], [
                'test_form' => false,
                'mimes' => [
                    'pdf' => 'application/pdf',
                    'dwg' => 'application/acad',
                    'dxf' => 'application/dxf',
                    'jpg|jpeg' => 'image/jpeg',
                    'png' => 'image/png'
                ]
            ]);

            if ($upload && !isset($upload['error'])) {
                $file_url = $upload['url'];
            }
        }
        
        // Calculate costs and generate PDF
        $pdf_data = generate_cost_estimate_pdf($data);
        $pdf_url = $pdf_data['url']; // Get the URL from the returned array

        // Save log
        $log_dir = WP_CONTENT_DIR . '/dummy-search-logs'; // Dummy log directory
        if (!file_exists($log_dir)) {
            wp_mkdir_p($log_dir);
        }

        // Call the address check function
        $address_check_result = check_scpafl_address_internal($data);

        // Send email - include pdf_url in the data
        $email_sent = send_data_to_email([
            'form_data' => $data,
            'file_url' => $file_url,
            'pdf_url' => $pdf_url, 
            'address_check' => $address_check_result
        ]);

        file_put_contents(
            $log_dir . '/search_' . date('Y-m-d') . '.log',
            print_r($data, true) . "\n" . print_r($address_check_result, true) . "\n\n",
            FILE_APPEND
        );

        return new WP_REST_Response([
            'status' => 'success',
            'message' => 'Data received successfully',
            'email_sent' => $email_sent,
            'received_data' => $data,
            'file_url' => $file_url,
            'pdf_url' => $pdf_url, 
            'address_check' => $address_check_result
        ], 200);

    } catch (Exception $e) {
        return new WP_REST_Response([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
}

// Include TCPDF
function include_tcpdf() {
    if (!class_exists('TCPDF')) {
        require_once get_template_directory() . '/libs/tcpdf/tcpdf.php';
    }
}
add_action('init', 'include_tcpdf');

function generate_cost_estimate_pdf($form_data) {
    // Ensure TCPDF is loaded
    if (!class_exists('TCPDF')) {
        require_once get_template_directory() . '/tcpdf/tcpdf.php';
    }
    
    // Create new PDF document
    $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    
    // Set document information
    $pdf->SetCreator('Your Company Name'); // Dummy company name
    $pdf->SetAuthor('Your Company Name'); // Dummy company name
    $pdf->SetTitle('Construction Cost Estimate');
    $pdf->SetSubject('Construction Estimate');
    
    // Remove default header/footer
    $pdf->setPrintHeader(false);
    $pdf->setPrintFooter(false);
    
    // Add a page
    $pdf->AddPage();
    
    // Set margins
    $pdf->SetMargins(15, 15, 15);
    
    // logo with better positioning and styling
    $logo_url = 'https://example.com/dummy-logo.png'; // Dummy logo URL
    $upload_dir = wp_upload_dir();
    $logo_path = str_replace(
        $upload_dir['baseurl'], 
        $upload_dir['basedir'], 
        $logo_url
    );

    // Calculate the X-coordinate to center the logo
    $page_width = $pdf->GetPageWidth();
    $logo_width = 30;
    $logo_x = ($page_width - $logo_width) / 2;

    // Note: For a dummy logo, file_exists will likely be false unless you place a dummy image.
    // The fallback text will be used in most dummy scenarios.
    if (file_exists($logo_path)) {
        $pdf->Image($logo_path, $logo_x, 10, $logo_width, 0, 'PNG', '', 'T', false, 300, '', false, false, 0, false, false, false); // Changed WEBP to PNG for generic dummy
    } else {
        // Fallback to text if logo fails
        $pdf->SetFont('helvetica', 'B', 18);
        $pdf->SetTextColor(44, 62, 80);
        $pdf->Cell(0, 10, 'Your Company Name', 0, 1, 'C'); // Dummy company name
    }
    
    
    // Title section with improved spacing and styling
    $pdf->SetY(45);
    $pdf->SetFont('helvetica', 'B', 20);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(0, 12, 'DETAILED CONSTRUCTION ESTIMATE', 0, 1, 'C');
    
    // Subtitle with date
    $pdf->SetFont('helvetica', 'I', 11);
    $pdf->SetTextColor(120, 120, 120);
    $pdf->Cell(0, 5, 'Generated on ' . date('F j, Y'), 0, 1, 'C');
    
    // Add horizontal line with more style
    $pdf->SetDrawColor(200, 200, 200);
    $pdf->Line(15, $pdf->GetY() + 8, 195, $pdf->GetY() + 8);
    $pdf->SetY($pdf->GetY() + 15);
    
    // Get selected model if available
    $selected_model = isset($form_data['selected_model']) ? $form_data['selected_model'] : null;
    
    // Calculate costs
    $calculated_costs = calculate_pdf_costs($form_data);
    
    // Project Overview section with improved padding
    $pdf->SetFont('helvetica', 'B', 14);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(0, 8, 'PROJECT OVERVIEW', 0, 1);
    $pdf->Ln(5); // Add space after heading

    // Create a light background for the overview section with padding
    $overview_height = 48;
    $pdf->SetFillColor(245, 248, 250);
    $pdf->Rect(15, $pdf->GetY(), 180, $overview_height, 'F');

    // Two column layout with proper padding
    $col1 = '';
    $col1 .= "Selected Model: " . ($selected_model['title'] ?? 'Not specified') . "\n\n";
    $col1 .= "Architectural Style: " . ($selected_model['style'] ?? ($form_data['styles'][0] ?? 'Not specified')) . "\n\n";
    $col1 .= "Total Living Area: " . number_format($selected_model['size'] ?? (($form_data['size_min'] + $form_data['size_max']) / 2)) . " sq.ft.\n\n";
    $col1 .= "Project Type: " . (!empty($form_data['is_renovation']) ? 'Renovation' : 'New Construction') . "\n";

    $col2 = '';
    $col2 .= "Estimated Total Cost: " . '$' . number_format($calculated_costs['total']) . "\n\n";
    $col2 .= "Location: " . ($form_data['property_address'] ?? 'Not specified') . "\n\n";
    $col2 .= "Stories: " . ($form_data['stories'] ?? '1') . "\n\n";
    $col2 .= "Garage: " . (empty($form_data['garage']) ? 'None' : $form_data['garage'] . '-car') . "\n";

    // Set starting Y position with top padding
    $start_y = $pdf->GetY() + 8;

    // First column with left padding
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(70, 70, 70);
    $pdf->MultiCell(90, 8, $col1, 0, 'L', false, 0, 20, $start_y);

    // Second column with left padding
    $pdf->MultiCell(90, 8, $col2, 0, 'L', false, 1, 110, $start_y);

    // Add space after the overview section
    $pdf->SetY($start_y + $overview_height - 8);
    $pdf->Ln(10);
    
    // Highlight box for note with improved styling
    $pdf->SetFillColor(255, 249, 242);
    $pdf->SetDrawColor(240, 230, 217);
    $pdf->SetFont('helvetica', 'I', 10);
    $pdf->SetTextColor(120, 90, 60);
    $pdf->MultiCell(0, 8, 'Note: This estimate is based on ' . (empty($form_data['styles']) ? 'standard specifications' : 'your selections') . ' and current market pricing. Final costs may vary based on site conditions, material availability, and design modifications.', 1, 'L', true);
    $pdf->Ln(12);
    
    // Custom Selections section with improved styling
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(0, 10, (empty($form_data['styles']) ? 'STANDARD SPECIFICATIONS' : 'YOUR CUSTOM SELECTIONS'), 0, 1);
    $pdf->Ln(5);
    
    // Custom selections table with better styling
    $pdf->SetFillColor(44, 62, 80);
    $pdf->SetTextColor(255, 255, 255);
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->Cell(100, 9, 'CATEGORY', 1, 0, 'L', true);
    $pdf->Cell(80, 9, empty($form_data['styles']) ? 'STANDARD VALUE' : 'SELECTION', 1, 1, 'L', true);
    
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(70, 70, 70);
    $fill = false;
    
    $selections = [
        'Preferred Styles' => implode(', ', array_map(function($style) { 
            return ucfirst($style); 
        }, $form_data['styles'] ?? [])),
        'Size Range' => isset($form_data['size_min']) ? 
            number_format($form_data['size_min']) . ' - ' . number_format($form_data['size_max']) . ' sq.ft.' : 
            'Not specified',
        'Bedrooms' => $form_data['bedrooms'] ?? 'Not specified',
        'Bathrooms' => $form_data['bathrooms'] ?? 'Not specified',
        'Kitchen Type' => isset($form_data['kitchen_type']) ? 
            ucfirst($form_data['kitchen_type']) : 'Not specified',
        'Additional Rooms' => !empty($form_data['additional_rooms']) ? 
            implode(', ', array_map(function($room) { 
                return ucfirst($room); 
            }, $form_data['additional_rooms'])) : 
            'None',
        'Flooring' => isset($form_data['flooring']) ? 
            ucfirst($form_data['flooring']) : 'Not specified',
        'Countertops' => isset($form_data['countertops']) ? 
            ucfirst($form_data['countertops']) : 'Not specified',
        'Cabinets' => isset($form_data['cabinets']) ? 
            ucfirst($form_data['cabinets']) : 'Not specified',
        'Appliances' => isset($form_data['appliances']) ? 
            ucfirst($form_data['appliances']) : 'Not specified',
        'Bath Fixtures' => isset($form_data['bath_fixtures']) ? 
            ucfirst($form_data['bath_fixtures']) : 'Not specified',
        'Budget Range' => isset($form_data['budget_min']) ? 
            '$' . number_format($form_data['budget_min']) . ' - $' . number_format($form_data['budget_max']) : 
            'Not specified'
    ];
    
    foreach ($selections as $category => $value) {
        $pdf->SetFillColor($fill ? 245 : 255, $fill ? 245 : 255, $fill ? 245 : 255);
        $pdf->Cell(100, 8, $category, 1, 0, 'L', $fill);
        $pdf->Cell(80, 8, $value, 1, 1, 'L', $fill);
        $fill = !$fill;
    }
    $pdf->Ln(15);
    
    // Features section if available with better styling
    if (!empty($form_data['features'])) {
        $pdf->SetFont('helvetica', 'B', 16);
        $pdf->SetTextColor(44, 62, 80);
        $pdf->Cell(0, 10, (empty($form_data['styles']) ? 'STANDARD FEATURES' : 'SELECTED FEATURES'), 0, 1);
        $pdf->Ln(5);
        
        $pdf->SetFont('helvetica', '', 10);
        $pdf->SetTextColor(70, 70, 70);
        
        // Create a light background for features
        $pdf->SetFillColor(250, 250, 250);
        $pdf->Rect(15, $pdf->GetY(), 180, count($form_data['features']) * 7 + 10, 'F');
        
        foreach ($form_data['features'] as $feature) {
            $pdf->SetTextColor(44, 62, 80);
            $pdf->SetFont('helvetica', 'B', 10);
            $pdf->Cell(5, 7, '', 0, 0);
            $pdf->Cell(5, 7, '•', 0, 0);
            $pdf->SetTextColor(70, 70, 70);
            $pdf->SetFont('helvetica', '', 10);
            $pdf->Cell(0, 7, ' ' . $feature, 0, 1);
        }
        $pdf->Ln(12);
    }
    
    // Cost Breakdown section with improved styling
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(0, 10, 'DETAILED COST BREAKDOWN', 0, 1);
    $pdf->Ln(5);
    
    // Define new column widths for the table
    $item_width = 60;
    $description_width = 85;
    $cost_width = 35;
    
    // Cost breakdown table header with dark blue color
    $pdf->SetFillColor(44, 62, 80);
    $pdf->SetTextColor(255, 255, 255);
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->Cell($item_width, 9, 'ITEM', 1, 0, 'L', true);
    $pdf->Cell($description_width, 9, 'DESCRIPTION', 1, 0, 'L', true);
    $pdf->Cell($cost_width, 9, 'COST', 1, 1, 'R', true);
    
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(70, 70, 70);
    $fill = false;
    
    $cost_items = [
        'Base Construction' => [
            'desc' => 'Includes foundation, framing, roofing, and basic finishes',
            'cost' => $calculated_costs['baseConstruction']
        ],
        ($form_data['garage'] == '0' ? 'No Garage' : $form_data['garage'] . '-Car Garage') => [
            'desc' => $form_data['garage'] == '0' ? 'No garage included' : 'Garage with automatic opener and finished interior',
            'cost' => $calculated_costs['garage']
        ],
        $form_data['bedrooms'] . ' Bedrooms' => [
            'desc' => 'Includes flooring, pre-wiring, and basic closet organization',
            'cost' => $calculated_costs['bedrooms']
        ],
        $form_data['bathrooms'] . ' Bathrooms' => [
            'desc' => 'Includes fixtures, tile work, and countertops',
            'cost' => $calculated_costs['bathrooms']
        ],
        ucfirst($form_data['kitchen_type']) . ' Kitchen' => [
            'desc' => 'Includes cabinets, countertops, and basic appliances',
            'cost' => $calculated_costs['kitchen']
        ]
    ];
    
    // Add additional rooms if any
    if (!empty($form_data['additional_rooms'])) {
        $cost_items['Additional Rooms'] = [
            'desc' => implode(', ', array_map('ucfirst', $form_data['additional_rooms'])),
            'cost' => $calculated_costs['additionalRooms']
        ];
    }
    
    // Add finishes
    $cost_items += [
        'Flooring (' . ucfirst($form_data['flooring']) . ')' => [
            'desc' => 'Flooring throughout main living areas',
            'cost' => $calculated_costs['flooring']
        ],
        'Countertops (' . ucfirst($form_data['countertops']) . ')' => [
            'desc' => 'Kitchen and bathroom countertops',
            'cost' => $calculated_costs['countertops']
        ],
        'Cabinets (' . ucfirst($form_data['cabinets']) . ')' => [
            'desc' => 'Kitchen and bathroom cabinetry',
            'cost' => $calculated_costs['cabinets']
        ],
        'Appliances (' . ucfirst($form_data['appliances']) . ')' => [
            'desc' => 'Kitchen and laundry appliances',
            'cost' => $calculated_costs['appliances']
        ],
        'Bath Fixtures (' . ucfirst($form_data['bath_fixtures']) . ')' => [
            'desc' => 'Bathroom faucets, showers, and fixtures',
            'cost' => $calculated_costs['bathFixtures']
        ]
    ];
    
    // Add renovation adjustment if applicable
    if (!empty($form_data['is_renovation'])) {
        $cost_items['Renovation Adjustment'] = [
            'desc' => 'Credit for existing structure and reusable elements',
            'cost' => -$calculated_costs['renovationAdjustment']
        ];
    }
    
    foreach ($cost_items as $item => $details) {
        $pdf->SetFillColor($fill ? 249 : 255, $fill ? 249 : 255, $fill ? 249 : 255);
        
        // Calculate cell height based on description text
        $desc_height = $pdf->getStringHeight($description_width, $details['desc'], false, true, '', 1);
        $cell_height = max(8, $desc_height);
        
        $current_x = $pdf->GetX();
        $current_y = $pdf->GetY();
        
        $pdf->MultiCell($item_width, $cell_height, $item, 1, 'L', $fill, 0, $current_x, $current_y, true, 0, false, true, $cell_height, 'M', true);
        $pdf->MultiCell($description_width, $cell_height, $details['desc'], 1, 'L', $fill, 0, $current_x + $item_width, $current_y, true, 0, false, true, $cell_height, 'M', true);
        $pdf->MultiCell($cost_width, $cell_height, '$' . number_format($details['cost']), 1, 'R', $fill, 1, $current_x + $item_width + $description_width, $current_y, true, 0, false, true, $cell_height, 'M', true);
        
        $fill = !$fill;
    }
    
    // Total row with accent color
    $pdf->SetFont('helvetica', 'B', 11);
    $pdf->SetFillColor(230, 126, 34);
    $pdf->SetTextColor(255, 255, 255);
    $pdf->Cell($item_width + $description_width, 10, 'TOTAL ESTIMATED COST', 1, 0, 'R', true);
    $pdf->Cell($cost_width, 10, '$' . number_format($calculated_costs['total']), 1, 1, 'R', true);
    $pdf->Ln(15);
    
    // Contact Information section
    $pdf->SetFont('helvetica', 'B', 16);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(0, 10, 'CONTACT INFORMATION', 0, 1, 'L');
    $pdf->Ln(5);

    // Style the information block
    $pdf->SetFillColor(245, 248, 250);
    $pdf->SetDrawColor(220, 220, 220);
    $pdf->Rect(15, $pdf->GetY(), 180, 25, 'DF');
    
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(40, 6, 'Name:', 0, 0, 'L');
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(70, 70, 70);
    $pdf->Cell(0, 6, !empty($form_data['contact_name']) ? esc_html($form_data['contact_name']) : 'Not provided', 0, 1);
    
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(40, 6, 'Email:', 0, 0, 'L');
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(70, 70, 70);
    $pdf->Cell(0, 6, !empty($form_data['contact_email']) ? esc_html($form_data['contact_email']) : 'Not provided', 0, 1);
    
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(40, 6, 'Phone:', 0, 0, 'L');
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(70, 70, 70);
    $pdf->Cell(0, 6, !empty($form_data['contact_phone']) ? esc_html($form_data['contact_phone']) : 'Not provided', 0, 1);
    $pdf->Ln(15);

    // Important notes with better styling
    $pdf->SetFillColor(249, 249, 249);
    $pdf->SetDrawColor(221, 221, 221);
    $pdf->SetFont('helvetica', 'B', 12);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(0, 14, 'IMPORTANT NOTES:', 1, 1, 'L', true);
    $pdf->Ln(2);
    $pdf->SetFont('helvetica', '', 10);
    $pdf->SetTextColor(70, 70, 70);
    
    $notes = [
        'This estimate is valid for 30 days from the date shown above',
        'Final costs may vary based on site conditions, material availability, and design modifications',
        'Does not include land costs, permits, or site preparation unless specified',
        'Consult with our team for a more detailed quote based on final plans'
    ];
    
    foreach ($notes as $note) {
        $pdf->Cell(5, 6, '', 0, 0);
        $pdf->Cell(5, 6, '•', 0, 0);
        $pdf->Cell(0, 6, ' ' . $note, 0, 1);
    }
    
    // Footer with improved styling
    $pdf->SetY(-40);
    $pdf->SetFont('helvetica', 'I', 10);
    $pdf->SetTextColor(100, 100, 100);
    $pdf->Cell(0, 6, 'Thank you for considering Your Company Name for your project.', 0, 1, 'C'); // Dummy company name
    
    $pdf->SetFont('helvetica', '', 9);
    $pdf->SetTextColor(120, 120, 120);
    $pdf->Cell(0, 5, '© ' . date('Y') . ' Your Company Name. All Rights Reserved.', 0, 1, 'C'); // Dummy company name
    
    $pdf->SetFont('helvetica', 'B', 10);
    $pdf->SetTextColor(44, 62, 80);
    $pdf->Cell(0, 5, 'Call us at: (123) 456-7890', 0, 1, 'C'); // Dummy phone number
    
    // Generate unique filename
    $filename = 'estimate_' . time() . '.pdf';
    $upload_dir = wp_upload_dir();
    $filepath = $upload_dir['path'] . '/' . $filename;
    
    // Save PDF to uploads directory
    $pdf->Output($filepath, 'F');
    
    // Return the URL to the PDF
    return [
        'url' => $upload_dir['url'] . '/' . $filename,
        'path' => $filepath
    ];
}

function calculate_pdf_costs($form_data) {
    $costs = [];
    
    // Get size - prefer selected model size if available
    $size = isset($form_data['selected_model']['size']) ? 
        $form_data['selected_model']['size'] : 
        (($form_data['size_min'] + $form_data['size_max']) / 2);
    
    // Style multiplier
    $style = strtolower($form_data['styles'][0] ?? 'traditional');
    $style_multiplier = [
        'modern' => 1.1,
        'traditional' => 1.0,
        'farmhouse' => 1.05,
        'ranch' => 0.95,
        'colonial' => 1.1,
        'contemporary' => 1.15,
        'luxury' => 1.3,
        'coastal' => 1.1,
        'craftsman' => 1.08,
        'mediterranean' => 1.2,
        'townhome' => 0.9,
        'villa' => 1.25
    ][$style] ?? 1.0;
    
    // Stories multiplier
    $stories_multiplier = [
        '1' => 1.0,
        '1.5' => 1.05,
        '2' => 1.1,
        '3' => 1.2
    ][$form_data['stories'] ?? '1'] ?? 1.0;
    
    // Base construction cost
    $base_cost_per_sqft = 150;
    $costs['baseConstruction'] = $size * $base_cost_per_sqft * $style_multiplier * $stories_multiplier;
    
    // Garage cost
    $costs['garage'] = [
        '0' => 0,
        '1' => 15000,
        '2' => 25000,
        '3' => 35000,
        '4' => 50000
    ][$form_data['garage'] ?? '0'] ?? 0;
    
    // Bedrooms cost
    $costs['bedrooms'] = [
        '1' => 0,
        '2' => 5000,
        '3' => 10000,
        '4' => 15000,
        '5' => 20000,
        '6' => 25000
    ][$form_data['bedrooms'] ?? '3'] ?? 0;
    
    // Bathrooms cost
    $costs['bathrooms'] = [
        '1' => 0,
        '1.5' => 7500,
        '2' => 15000,
        '2.5' => 22500,
        '3' => 30000,
        '3.5' => 37500,
        '4' => 45000
    ][$form_data['bathrooms'] ?? '2'] ?? 0;
    
    // Kitchen cost
    $costs['kitchen'] = [
        'basic' => 10000,
        'standard' => 20000,
        'gourmet' => 35000,
        'luxury' => 50000
    ][$form_data['kitchen_type'] ?? 'standard'] ?? 0;
    
    // Additional rooms
    $costs['additionalRooms'] = 0;
    if (!empty($form_data['additional_rooms'])) {
        foreach ($form_data['additional_rooms'] as $room) {
            $costs['additionalRooms'] += [
                'office' => 5000,
                'mudroom' => 3000,
                'laundry' => 4000,
                'pantry' => 2500
            ][$room] ?? 0;
        }
    }
    
    // Finishes
    $costs['flooring'] = $size * [
        'laminate' => 3.5,
        'engineered' => 7.5,
        'hardwood' => 11.5,
        'tile' => 8.0
    ][$form_data['flooring'] ?? 'engineered'] ?? 0;
    
    $costs['countertops'] = 50 * [ // Assuming 50 sq.ft. of countertops
        'laminate' => 35,
        'quartz' => 85,
        'granite' => 70,
        'marble' => 137.5
    ][$form_data['countertops'] ?? 'quartz'] ?? 0;
    
    // Allowances
    $costs['cabinets'] = [
        'basic' => 20000,
        'standard' => 30000,
        'premium' => 42500
    ][$form_data['cabinets'] ?? 'standard'] ?? 0;
    
    $costs['appliances'] = [
        'basic' => 6500,
        'standard' => 10000,
        'premium' => 18500
    ][$form_data['appliances'] ?? 'standard'] ?? 0;
    
    $num_bathrooms = (float)($form_data['bathrooms'] ?? 2);
    $costs['bathFixtures'] = $num_bathrooms * [
        'basic' => 3000,
        'standard' => 5500,
        'premium' => 11000
    ][$form_data['bath_fixtures'] ?? 'standard'] ?? 0;
    
    // Subtotal
    $costs['subtotal'] = $costs['baseConstruction'] + $costs['garage'] + $costs['bedrooms'] + 
                        $costs['bathrooms'] + $costs['kitchen'] + $costs['additionalRooms'] + 
                        $costs['flooring'] + $costs['countertops'] + $costs['cabinets'] + 
                        $costs['appliances'] + $costs['bathFixtures'];
    
    // Renovation adjustment
    $costs['renovationAdjustment'] = !empty($form_data['is_renovation']) ? $costs['subtotal'] * 0.3 : 0;
    $costs['total'] = $costs['subtotal'] - $costs['renovationAdjustment'];
    
    return $costs;
}

function check_scpafl_address_internal($submission_data) {
    $address = isset($submission_data['property_address']) ? trim($submission_data['property_address']) : '';

    if (empty($address)) {
        return [
            'status' => 'error',
            'message' => 'Address is empty.',
            'address_found' => false
        ];
    }
    
    $sanitized_address = urlencode(strtoupper($address));

    // Replaced specific external address search URL with a dummy one
    $search_results_url = "https://example.com/dummy-address-search?query=$sanitized_address";
    
    return [
        'status' => 'success',
        'message' => 'A direct match could not be found due to the website\'s dynamic content. Please click the link below to view the search results and find the property manually.',
        'address_found' => false,
        'search_results_url' => $search_results_url
    ];
}

function send_data_to_email($submission_data) {
    $to = get_option('admin_email'); // Use WordPress admin email as dummy recipient
    // $to = "dummy@example.com"; // Alternative dummy email
    $subject = 'New Home Style Search Submission';
    
    $body = "<h2>New Home Style Search Submission</h2>";
    $body .= "<p><strong>Date:</strong> " . date('F j, Y g:i a') . "</p>";
    
    // Style Preferences
    $body .= "<h3>Style Preferences:</h3>";
    $body .= "<ul>";
    if (isset($submission_data['form_data']['styles'])) {
        foreach ($submission_data['form_data']['styles'] as $style) {
            $body .= "<li>" . esc_html($style) . "</li>";
        }
    }
    $body .= "</ul>";
    
    // Size Preferences
    $body .= "<h3>Size Preferences:</h3>";
    $body .= "<p>Minimum: " . esc_html($submission_data['form_data']['size_min']) . " sq ft</p>";
    $body .= "<p>Maximum: " . esc_html($submission_data['form_data']['size_max']) . " sq ft</p>";
    $body .= "<p>Stories: " . (isset($submission_data['form_data']['stories']) ? esc_html($submission_data['form_data']['stories']) : 'Not specified') . "</p>";
    $body .= "<p>Garage: " . (isset($submission_data['form_data']['garage']) ? esc_html($submission_data['form_data']['garage']) : 'Not specified') . "</p>";
    
    // Rooms and Baths
    $body .= "<h3>Rooms Configuration:</h3>";
    $body .= "<p>Bedrooms: " . (isset($submission_data['form_data']['bedrooms']) ? esc_html($submission_data['form_data']['bedrooms']) : 'Not specified') . "</p>";
    $body .= "<p>Bathrooms: " . (isset($submission_data['form_data']['bathrooms']) ? esc_html($submission_data['form_data']['bathrooms']) : 'Not specified') . "</p>";
    $body .= "<p>Kitchen Type: " . (isset($submission_data['form_data']['kitchen_type']) ? esc_html(ucfirst($submission_data['form_data']['kitchen_type'])) : 'Not specified') . "</p>";
    
    // Additional Rooms
    if (isset($submission_data['form_data']['additional_rooms']) && !empty($submission_data['form_data']['additional_rooms'])) {
        $body .= "<h3>Additional Rooms:</h3>";
        $body .= "<ul>";
        foreach ($submission_data['form_data']['additional_rooms'] as $room) {
            $body .= "<li>" . esc_html(ucfirst($room)) . "</li>";
        }
        $body .= "</ul>";
    }
    
    // Finishes
    $body .= "<h3>Finishes:</h3>";
    $body .= "<p>Flooring: " . (isset($submission_data['form_data']['flooring']) ? esc_html(ucfirst($submission_data['form_data']['flooring'])) : 'Not specified') . "</p>";
    $body .= "<p>Countertops: " . (isset($submission_data['form_data']['countertops']) ? esc_html(ucfirst($submission_data['form_data']['countertops'])) : 'Not specified') . "</p>";
    
    // Budget
    $body .= "<h3>Budget:</h3>";
    $body .= "<p>$" . number_format($submission_data['form_data']['budget_min']) . " - $" . 
             number_format($submission_data['form_data']['budget_max']) . "</p>";
    
    // Allowances
    $body .= "<h3>Allowances:</h3>";
    $body .= "<p>Cabinets: " . (isset($submission_data['form_data']['cabinets']) ? esc_html(ucfirst($submission_data['form_data']['cabinets'])) : 'Not specified') . "</p>";
    $body .= "<p>Appliances: " . (isset($submission_data['form_data']['appliances']) ? esc_html(ucfirst($submission_data['form_data']['appliances'])) : 'Not specified') . "</p>";
    $body .= "<p>Bath Fixtures: " . (isset($submission_data['form_data']['bath_fixtures']) ? esc_html(ucfirst($submission_data['form_data']['bath_fixtures'])) : 'Not specified') . "</p>";
    
    // Features
    $body .= "<h3>Features:</h3>";
    $body .= "<ul>";
    if (isset($submission_data['form_data']['features'])) {
        foreach ($submission_data['form_data']['features'] as $feature) {
            $body .= "<li>" . esc_html($feature) . "</li>";
        }
    } else {
        $body .= "<li>No features selected</li>";
    }
    $body .= "</ul>";
    
    // Property Information
    $body .= "<h3>Property Information:</h3>";
    $body .= "<p>Address: " . esc_html($submission_data['form_data']['property_address']) . "</p>";
    $body .= "<p>Project Type: " . ($submission_data['form_data']['is_renovation'] ? 'Renovation' : 'New Construction') . "</p>";
    
	$body .= "<h3>Contact Information:</h3>";
    $body .= "<p>Name: " . esc_html($submission_data['form_data']['contact_name']) . "</p>";
    $body .= "<p>Email: " . esc_html($submission_data['form_data']['contact_email']) . "</p>";
    $body .= "<p>Phone: " . esc_html($submission_data['form_data']['contact_phone']) . "</p>";
	
    // Cost Estimate
    if (isset($submission_data['estimated_cost'])) {
        $body .= "<h3>Estimated Cost:</h3>";
        $body .= "<p>$" . number_format($submission_data['estimated_cost']) . "</p>";
    }
    
    // Selected Model (if applicable)
    if (isset($submission_data['selected_model'])) {
        $body .= "<h3>Selected Model:</h3>";
        $body .= "<p>" . esc_html($submission_data['selected_model']['title']) . "</p>";
        $body .= "<p>Style: " . esc_html($submission_data['selected_model']['style']) . "</p>";
        $body .= "<p>Size: " . esc_html($submission_data['selected_model']['size']) . " sq ft</p>";
    }
    
    // File attachment
    if (isset($submission_data['file_url']) && !empty($submission_data['file_url'])) {
        $body .= "<p><strong>Survey File:</strong> <a href='" . esc_url($submission_data['file_url']) . "'>Download File</a></p>";
    }
    
    // Add PDF download link
    if (!empty($submission_data['pdf_url'])) {
        $body .= "<h3>Cost Estimate:</h3>";
        $body .= "<p><a href='" . esc_url($submission_data['pdf_url']) . "' target='_blank'>Download Detailed Cost Estimate PDF</a></p>";
    }
	
    // Email headers
    $headers = array(
        'Content-Type: text/html; charset=UTF-8',
        'From: Your Company Name <noreply@' . $_SERVER['HTTP_HOST'] . '>' // Dummy company name
    );

    return wp_mail($to, $subject, $body, $headers);
}

add_action('wp_head', function() {
    echo '<script>window.foxApiSettings = {';
    echo 'root: "' . esc_url_raw(rest_url()) . '",';
    echo 'nonce: "' . wp_create_nonce('wp_rest') . '"';
    echo '};</script>';
});