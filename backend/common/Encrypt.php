<?
namespace common;
class Encrypt{

    public static $key = 'b6kvneYUOJrajznRGfy6333J2i4zbWSh';
    public static $iv = 'Gw55S8IMeXBiGDKb';


    public static function en($arrayData){
        $ciphertext_raw = openssl_encrypt(json_encode($arrayData,JSON_UNESCAPED_UNICODE),'AES-256-CBC', static::$key, OPENSSL_RAW_DATA, static::$iv);
        //$hmac = hash_hmac('sha256', $ciphertext_raw, static::$key, true);
        $ciphertext = base64_encode($ciphertext_raw);
        return array('body'=>$ciphertext);
    }

    public static function de($encrypted_data){

        $decrypted = openssl_decrypt(base64_decode($encrypted_data), 'AES-256-CBC', static::$key, OPENSSL_RAW_DATA, static::$iv);
        return json_decode($decrypted,JSON_UNESCAPED_UNICODE);

    }
}