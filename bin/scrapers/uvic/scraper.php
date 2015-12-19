<?php
global $separator;
$separator = "\r\n";
$debugFile = "debug.html";
/*
$workingDir = dirname(__FILE__)."/course.data";

// Change working directory
if(!file_exists($workingDir)){
    mkdir($workingDir);
}
chdir($workingDir);
*/
// ===== Helper functions ======================================================
function postRequest($url, $data=array()){
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ),
    );
    $context  = stream_context_create($options);
    return file_get_contents($url, false, $context);
}
function postRequestOverride($url, $data){
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => $data,
        ),
    );
    $context  = stream_context_create($options);
    return file_get_contents($url, false, $context);
}

function seekToPattern($needle, $haystack){
    global $separator;

    $haystack = strtok($haystack, $separator);
    while ($haystack !== false) {
        $haystack = strtok($separator);
        if(preg_match($needle, $haystack)){
            break;
        }
    }
    return $haystack;
}

function seekToNextPattern($needle){
    global $separator;

    $line = strtok($separator);
    while ($line !== false) {
        $line = strtok($separator);
        if(preg_match($needle, $line)){
            break;
        }
    }
    return $line;
}
function initInfo(){
    $info['crn'] = ' ';
    $info['subject'] = ' ';
    $info['course'] = ' ';
    $info['section'] = ' ';
    $info['credits'] = ' ';
    $info['name'] = ' ';
    $info['days'] = ' ';
    $info['time'] = ' ';
    $info['capacity'] = '0';
    $info['actual'] = '0';
    $info['remaining'] = '0';
    $info['wlcapacity'] = '0';
    $info['wlactual'] = '0';
    $info['wlremaining'] = '0';
    $info['xlcapacity'] = '0';
    $info['xlactual'] = '0';
    $info['xlremaining'] = '0';
    $info['instructor'] = ' ';
    $info['date'] = ' ';
    $info['room'] = ' ';
    return $info;
}

function translateDateRange($daterange){
    // Jan 04, 2016 - Apr 04, 2016
    // 01/04-04/04
    preg_match('/^(.*) - (.*)$/', $daterange, $matches);
    if(count($matches) != 3){
        // Does not match format (e.g. could be TBD)
        return $daterange;
    }
    $start = $matches[1];
    $end = $matches[2];

    return date('m/d', strtotime($start)).'-'.date('m/d', strtotime($end));
}

// ===== Get the IDs for the 3 most recent terms ===============================
//echo 'Fetching page with term list'.PHP_EOL;
$url = 'https://www.uvic.ca/BAN2P/bwckschd.p_disp_dyn_sched';
$pageContent = postRequest($url);

// Process page content line by line until the IDs for the terms are found
//echo 'Parsing page'.PHP_EOL;
$line = seekToPattern('/ID="term_input_id"/', $pageContent);
$line = strtok($separator);
//echo "preg".PHP_EOL;
if(!preg_match('/VALUE="">None/', $line, $matches)){
    //echo 'Unexpected first value in term selection - should be None but it is this:'.PHP_EOL;
    //echo $line.PHP_EOL;
}

$line = strtok($separator);
preg_match('/VALUE="(\d+)"/', $line, $matches);
$term = $matches[1];



    // Create or empty previous file
/*
    $outputfile = "${term}.courselist";
    if(file_exists($outputfile)){
        rename($outputfile, "${outputfile}.last");
    }

*/

    // ===== Get list of subjects for this term ====================================

    //echo "Fetching subject list for term $term".PHP_EOL;
    $url = 'https://www.uvic.ca/BAN2P/bwckgens.p_proc_term_date';
    $data = array('p_calling_proc' => 'bwckschd.p_disp_dyn_sched', 'p_term' => $term);
    $pageContent = postRequest($url, $data);

    // Store values in sel_subj array
    $line = seekToPattern('/ID="subj_id"/', $pageContent);
    $subjects = array();
    while($line !== false){
        $line = strtok($separator);
        if(preg_match('/OPTION VALUE="(.*)"/', $line, $matches) == 0){
            // Line did not match
            break;
        }
        $subjects[] = $matches[1];
    }

    // Prepare output heading
    //$textrow = "CRN!Subject!Course!Section!Credits!Name!Days!Time!Capacity!Actual!Remaining!WLCapacity!WLActual!WLRemaining!XLCapacity!XLActual!XLRemaining!Instructor!Date!Room";
    $output = '';//$textrow.PHP_EOL;

    // ===== Get data for each subject =============================================
    //echo "Iterating through each subject".PHP_EOL;
    $url = 'http://www.uvic.ca/BAN2P/bwckschd.p_get_crse_unsec';

    // Iterate through courses
    foreach($subjects as $subject){
        
        // Get  all courses for $subject
        //echo "Getting $subject courses".PHP_EOL;
        $data = "term_in=${term}&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=${subject}&sel_crse=&sel_title=&sel_schd=%25&sel_insm=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_levl=%25&sel_ptrm=%25&sel_instr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a";
        $pageContent = postRequestOverride($url, $data);

        //*/
        /*
        $subject = $subjects[0];
        $data = "term_in=${term[0]}&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy&sel_subj=${subject}&sel_crse=&sel_title=&sel_schd=%25&sel_insm=%25&sel_from_cred=&sel_to_cred=&sel_camp=%25&sel_levl=%25&sel_ptrm=%25&sel_instr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a";
        $pageContent = postRequestOverride($url, $data);
        //*/

        // Parse course data on page
        // Init $info
        $info = initInfo();

        // Seek to first course on page
        $line = seekToPattern('/sections found/', $pageContent);
        //$line = strtok($separator);
        //$line = strtok($separator);


        // Seek to course title
        $line = seekToNextPattern('/CLASS="ddtitle"/', $pageContent);
        while ($line !== false) {

            // Get name, CRN, subject, course, and section
            preg_match('/<A.*?>(.*?)</', $line, $matches);
            $longtitle = $matches[1];
            preg_match('/^(.*) - (\d{5}) - (\D+?) (\d+\w*) - (\w\d{2})$/', $longtitle, $matches);
            $info['name'] = $matches[1];
            $info['crn'] = $matches[2];
            $info['subject'] = $matches[3];
            $info['course'] = $matches[4];
            $info['section'] = $matches[5];

            // Get credits
            $line = seekToNextPattern('/^\s+(\d.*) Credits/');
            preg_match('/^\s+(\d.*) Credits/', $line, $matches);
            $info['credits'] = $matches[1];

            // Get meeting times/locations
            $line = seekToNextPattern('/<TABLE  CLASS="datadisplaytable"/');
            //$line = seekToNextPattern('/<TR>/'); // First <tr> has the table headings
            //$line = seekToNextPattern('/<TR>/'); // Subsequent <tr>'s have meeting times
            $line = seekToNextPattern('/<\/TR>/');
            $line = strtok($separator);

            while($line == '<TR>'){

                $line = strtok($separator);
                preg_match('/>([^<>]+)</', $line, $matches);
                if($matches[1] != 'Every Week'){
                    echo "This one doesn't say every week!".PHP_EOL;
                    echo $line.PHP_EOL;
                }

                $line = strtok($separator);
                preg_match('/>([^<>]+)</', $line, $matches);
                $info['time'] = $matches[1];

                $line = strtok($separator);
                preg_match('/>([^<>]+)</', $line, $matches);
                $info['days'] = $matches[1];
                $info['days'] = ($info['days'] == '&nbsp;') ? ' ' : $info['days'];

                $line = strtok($separator);
                preg_match('/>([^<>]+)</', $line, $matches);
                $info['room'] = $matches[1];

                $line = strtok($separator);
                preg_match('/>([^<>]+)</', $line, $matches);
                $info['date'] = translateDateRange($matches[1]);

                $line = strtok($separator);
                $line = strtok($separator);
                preg_match('/>([^<>]+?)\s*\(?</', $line, $matches);
                $info['instructor'] = $matches[1];

                $textrow = 
                    $info['crn'].'!'.
                    $info['subject'].'!'.
                    $info['course'].'!'.
                    $info['section'].'!'.
                    $info['credits'].'!'.
                    $info['name'].'!'.
                    $info['days'].'!'.
                    $info['time'].'!'.
                    $info['capacity'].'!'.
                    $info['actual'].'!'.
                    $info['remaining'].'!'.
                    $info['wlcapacity'].'!'.
                    $info['wlactual'].'!'.
                    $info['wlremaining'].'!'.
                    $info['xlcapacity'].'!'.
                    $info['xlactual'].'!'.
                    $info['xlremaining'].'!'.
                    $info['instructor'].'!'.
                    $info['date'].'!'.
                    $info['room'].
                    PHP_EOL
                ;

                //echo $textrow;
                $output .= $textrow;

                $line = strtok($separator);
                $line = strtok($separator);

                // If $line is <TR> again then there's another row in the table
                $info = initInfo();
            }

            // Seek to next course/section if there is another one on this page
            $line = seekToNextPattern('/CLASS="ddtitle"/', $pageContent);
					echo $output;
        //file_put_contents($outputfile, $output, FILE_APPEND);
        $output = "";
        }
    }
    //echo "Finished getting courses for ${term}".PHP_EOL;

    // Upload to file to server
    // Trigger import script with API call


//file_put_contents($debugFile, $pageContent);
echo 'DONE'.PHP_EOL;
