<?
namespace controller;
use common;
use common\Encrypt;
use firebase\jwt\JWT;
use firebase\jwt\Key;
class Api{

    function __construct(){

        global $db,$lib;
        
        $this->db = $db;
        $this->lib = $lib;
        $this->jwt->key = 'ksksksksksksksksksksk';
        $this->post = json_decode(file_get_contents( 'php://input' ),JSON_UNESCAPED_UNICODE);
    
        $this->post = Encrypt::de($this->post['body']);

    }

    /***
     * /api/login
     */
    function login(){

        $res = array('msg'=>'no');
        
        if(!$this->post['email'] || !$this->post['password']){
            
            header("HTTP/1.0 400 Bad Request");
            echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);
            exit;

        }else{


            $query = "select count(*) as cnt from ".$this->db->tables['member']." where email=? and password=?";
            list($data) = $this->db->query($query,"ss",array($this->post['email'],$this->post['password']));


            if($data['cnt']==1){

                $accessTokenPayload = array(
                    'email'=>$this->post['email'],
                    'iat'=>time(),
                    'exp'=>time()+(60*15)
                );

                $refreshTokenPayload = array(
                    'email'=>$this->post['email'],
                    'iat'=>time(),
                    'exp'=>time()+(60*60*24*180)
                );
                

                $res['msg'] = 'ok';
                $res['access_token'] = JWT::encode($accessTokenPayload, $this->jwt->key,'HS256');
                $res['refresh_token'] = JWT::encode($refreshTokenPayload, $this->jwt->key,'HS256');
            }

            
            
            echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);

        }
    }

    /***
     * /api/join
     */
    function join(){

        $res = array('msg'=>'no');

        $query = "select count(*) as cnt from ".$this->db->tables['member']." where email=?";
        list($data) = $this->db->query($query,"s",$this->post['email']);

        if($data['cnt']==0){

            $query = "insert into ".$this->db->tables['member']." set email=?, password=?, insdt=now()";
            $this->db->query($query,"ss",array($this->post['email'],$this->post['password']));

            $res = array('msg'=>'ok');

        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }
        
        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);
    }

    /**
     * /api/find
     */
    function find(){

        $res = array('msg'=>'no');

        $query = "select count(*) as cnt from ".$this->db->tables['member']." where email=?";
        list($data) = $this->db->query($query,"s",$this->post['email']);

        if($data['cnt']==1){

            $query = "update ".$this->db->tables['member']." set password=? where email=?";
            $this->db->query($query,"ss",array($this->post['password'],$this->post['email']));

            $res = array('msg'=>'ok');

        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);
    }

    /***
     * /api/auth
     */
    function auth(){

        $res = array('msg'=>'no');

        $accessToken = $_SERVER["HTTP_AUTHORIZATION"];

        if($accessToken){
            try{
                $decoded = JWT::decode($accessToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                $res['msg'] = 'ok';
                $res['email'] = $decoded['email'];
            }catch(Exception $e){

            }
        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);
    }

    /***
     * /api/retoken
     */
    function retoken(){
        
        $res = array('msg'=>'no');

        $refreshToken = $this->post['refresh_token'];

        if($refreshToken){
            try{
                $decoded = JWT::decode($refreshToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                if($decoded['email']){
                    
                    $accessTokenPayload = array(
                        'email'=>$decoded['email'],
                        'iat'=>time(),
                        'exp'=>time()+(60*15)
                    );

                    $res['msg'] = 'ok';
                    $res['email'] = $decoded['email'];
                    $res['access_token'] = JWT::encode($accessTokenPayload, $this->jwt->key,'HS256');
                }
            }catch(Exception $e){

            }
        }
        
        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);

    }

    /***
     * /api/cheacktoken
     */
    function cheacktoken(){

        $res = array('msg'=>'no');

        $accessToken = $_SERVER["HTTP_AUTHORIZATION"];

        if($accessToken){
            try{
                $decoded = JWT::decode($accessToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                $res['msg'] = 'ok';
            }catch(Exception $e){

            }
        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);

    }

    /***
     * /api/estimate
     */
    function estimate(){
        
        $method2 = $this->lib->segment[4];

        if($method2=='save'){
            $this->estimateSave();
            exit;
        }

        if($method2=='send'){
            $this->estimateSend();
            exit;
        }

        if($method2=='quick'){
            $this->estimateQuick();
            exit;
        }
        
        if(is_numeric($method2)){
            $this->estimateGet($method2);
            exit;
        }
        
        $res = array('msg'=>'no');

        $accessToken = $_SERVER["HTTP_AUTHORIZATION"];
        
        if($accessToken){
            try{
                $decoded = JWT::decode($accessToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                
                $query = "select e.* from ".$this->db->tables['estimate']." as e left join ".$this->db->tables['member']." as m on e.memberIdx=m.idx where m.email=? order by e.insdt desc";
                $data = $this->db->query($query,"s",$decoded['email']);
                
                foreach($data as $k=>$v){
                    $data[$k]['data'] = json_decode($v['data'],JSON_UNESCAPED_UNICODE);
                }
                
                $res['msg'] = 'ok';
                $res['list'] = $data;
                
            }catch(Exception $e){

            }
        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }
        
        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);
    }

    /***
     * /api/estimate/save
     */
    function estimateSave(){
        
        $res = array('msg'=>'no');

        $accessToken = $_SERVER["HTTP_AUTHORIZATION"];
        
        if($accessToken){
            try{
                $decoded = JWT::decode($accessToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                
                $query = "select idx from ".$this->db->tables['member']." where email=?";
                list($data) = $this->db->query($query,"s",array($decoded['email']));
                
                $memberIdx = $data['idx'];
                
                if($memberIdx){

                    
                    if($this->post['number']==''){
                        //등록
                        $this->post['number'] = time();

                        $query = "insert into ".$this->db->tables['estimate']." set id=?,memberIdx=?,title=?,lastPrice=?,data=?,insdt=now()";
                        $this->db->query($query,"sisis",array($this->post['number'],$memberIdx,$this->post['title'],$this->post['lastPrice'],json_encode($this->post,JSON_UNESCAPED_UNICODE)));
                        
                        $res['msg'] = 'ok';
                        $res['id'] = $this->post['number'];
                    }else{
                        //수정    
                        $query = "update ".$this->db->tables['estimate']." set title=?, lastPrice=?, data=?, moddt=now() where id=? and memberIdx=?";
                        $this->db->query($query,"sissi",array($this->post['title'],$this->post['lastPrice'],json_encode($this->post,JSON_UNESCAPED_UNICODE),$this->post['number'],$memberIdx));
                        
                        $res['msg'] = 'ok';
                        $res['id'] = $this->post['number'];
                    }
                }

            }catch(Exception $e){

            }
        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);

    }

    /**
     * /api/estimate/[id]
     */
    function estimateGet($id){

        $res = array('msg'=>'no');

        $accessToken = $_SERVER["HTTP_AUTHORIZATION"];
        
        if($accessToken){

            try{

                $decoded = JWT::decode($accessToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                
                $query = "select idx from ".$this->db->tables['member']." where email=?";
                list($data) = $this->db->query($query,"s",array($decoded['email']));

                $query = "select data from ".$this->db->tables['estimate']." where id=? and memberIdx=?";
                list($data) = $this->db->query($query,'ii',array($id,$data['idx']));

                if($data['data']){
                    $res['msg'] = 'ok';
                    $res['data'] = json_decode($data['data'],JSON_UNESCAPED_UNICODE);
                }

            }catch(Exception $e){

            }

        }

        $guestToken = $_SERVER["HTTP_AUTHORIZATION"];

        if($res['msg'] == 'no' && $guestToken){

            try{

                $decoded = JWT::decode($accessToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                
                $query = "select data from ".$this->db->tables['estimate']." where id=? and guestPassword=?";
                list($data) = $this->db->query($query,'ii',array($id,$decoded['password']));

                if($data['data']){
                    $res['msg'] = 'ok';
                    $res['data'] = json_decode($data['data'],JSON_UNESCAPED_UNICODE);
                }

            }catch(Exception $e){

            }

        }

        
        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);

    }


    /**
     * /api/estimate/send
     */
    function estimateSend(){
        $res = array('msg'=>'no');

        $accessToken = $_SERVER["HTTP_AUTHORIZATION"];
        
        if($accessToken){

            try{

                $query = "update ".$this->db->tables['estimate']." set guestPassword=?  where id=?";
                $this->db->query($query,'si',array($this->post['guestPassword'],$this->post['id']));

                $res = array('msg'=>'ok');

            }catch(Exception $e){

            }

        }
        
        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);
    }

    /**
     * /api/estimate/quick
     */
    function estimateQuick(){

        $res = array('msg'=>'no');

        $accessToken = $_SERVER["HTTP_AUTHORIZATION"];
        
        if($accessToken){
            try{
                $decoded = JWT::decode($accessToken, new Key($this->jwt->key,'HS256'));
                $decoded = (array)$decoded;
                
                $query = "select e.data from ".$this->db->tables['estimate']." as e left join ".$this->db->tables['member']." as m on e.memberIdx=m.idx where m.email=? order by e.insdt desc limit 1";
                $data = $this->db->query($query,"s",$decoded['email']);
                
                foreach($data as $k=>$v){
                    $data[$k]['data'] = json_decode($v['data'],JSON_UNESCAPED_UNICODE);
                }
                
                $res['msg'] = 'ok';
                $res['list'] = $data;
                
            }catch(Exception $e){

            }
        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);

    }


    /***
     * /api/guest
     */
    function guest(){
        
        $method2 = $this->lib->segment[4];

        if($method2=='login'){
            $this->guestLogin();
            exit;
        }
        
    }

    /***
     * /api/guest/login
     */
    function guestLogin(){

        $res = array('msg'=>'no');

        if($this->post['id'] && $this->post['password']){

            $query = "select count(*) as cnt from ".$this->db->tables['estimate']." where id=? and guestPassword=?";
            list($data) = $this->db->query($query,"is",array($this->post['id'],$this->post['password']));
            
            if($data['cnt']==1){
                
                $guestTokenPayload = array(
                    'id'=>$this->post['id'],
                    'password'=>$this->post['password'],
                    'iat'=>time(),
                    'exp'=>time()+(60*15)
                );

                $res['msg'] = 'ok';
                $res['guest_token'] = JWT::encode($guestTokenPayload, $this->jwt->key,'HS256');
            }
        }

        if($res['msg']=='no'){
            header("HTTP/1.0 400 Bad Request");
        }

        echo json_encode(Encrypt::en($res),JSON_UNESCAPED_UNICODE);

    }

}
