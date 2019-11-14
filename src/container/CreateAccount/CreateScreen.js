import React, { Component } from 'react';
import { CSVLink } from "react-csv";
import { Button, message,Input } from 'antd';
import UColor from '../../util/Colors'
import './CreateScreen.css';
import {getMenWords,getAccount,getPrivateKey,getAccountId,signBytes,verifyBytes }from '../../util/getrandom'
const BigNumber = require('bignumber.js');
class CreateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',     //助记词
            publicKey: '',
            privateKey: '',
            accountId: '',
            inputAddress: '',   //绑定地址
            inputMenword: '',
            signData:'',    //签名数据
            selectButton: 0,
            headers:[
                {label: '助记词', key: 'men'},
                {label: 'accountID', key: 'ids'},
            ]
        };
        this.signValues = this.signValues.bind(this);
        this.veriSign = this.veriSign.bind(this);
    }

    // componentDidMount(){
    //     let list = [];
    //     for(let i = 0; i < 50000; i++){
    //         let text = getMenWords();
    //         let accounts = getAccountId(text);
    //         list.push({
    //             men: text,
    //             ids: accounts+'\t'
    //         })
    //     }
    //     this.setState({
    //         data: list
    //     })
    // }

    createAccount() {
        let text = getMenWords();
        let accounts = getAccountId(text)
        // let pri = getPrivateKey(text)
        // let pub = getAccount(text)
        this.setState({
            value: text,
            accountId: accounts,
            selectButton: 1,
            signData: '',
            inputAddress: '',
            inputMenword: ''
        })
    }
    signValues(){
        if(!this.state.inputAddress){
            message.warning('请输入绑定地址', 2)
            return;
        }else if(!this.state.inputMenword){
            message.warning('请输入您算力的脑密码', 2)
            return;
        }
        let address = this.state.inputAddress.substring(0,2) === '0x' ? this.state.inputAddress.substring(2) : this.state.inputAddress;
        let accounts = getAccountId(this.state.inputMenword)
        
        let strs = new BigNumber(accounts,10).toString(16) + address
        let text = signBytes(strs, this.state.inputMenword)
        this.setState({
            signData: text,
        })
    }

    veriSign(){
        let address = this.state.inputAddress.substring(0,2) === '0x' ? this.state.inputAddress.substring(2) : this.state.inputAddress;
        let accounts = getAccountId(this.state.inputMenword)

        let strs = new BigNumber(accounts,10).toString(16) + address;
        let publics = getAccount(this.state.inputMenword);
        
        alert(verifyBytes(this.state.signData,strs, publics))
    } 

    copy(){
        let copydoms = document.getElementById('copydom');
        let range = document.createRange()
        range.selectNodeContents(copydoms)
        let selection = document.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        document.execCommand("Copy"); // 执行浏览器复制命令
    }

    bindDataItem(){
        if(this.state.signData){
            return (
                <div className="singContent">
                    <p>{`把${this.state.accountId}绑定到${this.state.inputAddress}`}</p>
                    <p>{`你可以安全的拷贝并发送已签名的数据给${this.state.inputAddress}地址的拥有者以激活绑定`}</p>
                    <p id='copydom'>{this.state.signData}</p>

                    <div className='butRows'>
                        <Button 
                            size='large'
                            onClick={()=>{
                                this.copy()
                            }} 
                            style={{width: '140px',height: '34px',marginTop: '20px', marginLeft: '50px', borderColor:UColor.thkblue,color: UColor.thkblue}}
                        >拷贝</Button>
                        <Button 
                            size='large'
                            onClick={()=>{
                                this.signValues()
                            }} 
                            style={{width: '140px',height: '34px',marginTop: '20px',marginRight: '50px', borderColor:UColor.thkblue,color: UColor.thkblue}}
                        >重新绑定</Button>
                    </div>
                </div>
            )

        }else {
            return (
                <div className="contents">
                    <div className='contentRows'>
                        <p className='contentKeys'>绑给：</p>
                        <Input placeholder="请输入一个HNW硬币地址" value={this.state.inputAddress} style={{width: '540px', height: '30px'}} onChange={(e)=>{
                            this.setState({
                                inputAddress: e.target.value
                            })
                        }}/>
                    </div>
                    <div className='contentRows'>
                        <p className='contentKeys'>脑密码：</p>
                        <Input placeholder="请输入您算力的脑密码" value={this.state.inputMenword} style={{width: '540px', height: '30px'}} onChange={(e)=>{
                            this.setState({
                                inputMenword: e.target.value
                            })
                        }}/>
                    </div>
    
                    <Button 
                        size='large'
                        onClick={()=>{
                            this.signValues()
                        }} 
                        style={{width: '140px',height: '34px',marginTop: '20px', borderColor:UColor.thkblue,color: UColor.thkblue}}
                    >生成绑定数据</Button>
                </div>
            )

        }
    }

    createAccountItem(){
        return (
            <div className="contents">
                <div className='contentRow'>
                    <p className='contentKey'>脑密码：</p>
                    <p className='conts'>{this.state.value}</p>
                </div>
                <div className='contentRow'>
                    <p className='contentKey'>算力ID：</p>
                    <p className='conts'>{this.state.accountId}</p>
                </div>

                <p style={{
                    display: 'flex',
                    alignItems:'center',
                    justifyContent:'center',
                }}>
                <img src={require('../../image/iconjinggao.png')} 
                    style={{width: '16px', height: '16px',marginRight: '6px'}}
                />
                请保存好您的挖矿账号。</p>

                <Button 
                    size='large'
                    onClick={()=>{
                        this.createAccount()
                    }} 
                    style={{width: '140px',height: '34px',borderColor:UColor.thkblue,color: UColor.thkblue}}
                >重新生成</Button>
            </div>
        )
    }

    topTwoButton(){
        return (
            <div className='butRow'>
                <Button 
                    size='large'
                    onClick={()=>{
                        if(!this.state.value && !this.state.accountId){
                            this.createAccount()
                        }else if(this.state.selectButton !== 1){
                            this.setState({
                                selectButton: 1
                            })
                        }
                    }}
                    style={{width: '160px',
                        display: 'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor: this.state.selectButton === 1 ? UColor.thkblue : UColor.bg_color,
                        color: this.state.selectButton === 1 ? UColor.bg_color : UColor.thkfont_3
                    }}
                >
                <img src={this.state.selectButton === 1 ? require('../../image/iconwakuang_bai.png') : require('../../image/iconwakuang_hui.png')} 
                    style={{width: '16px', height: '16px',marginRight: '6px'}}
                />
                生成账户</Button>
                {this.state.data ?
                <CSVLink data={this.state.data} headers={this.state.headers}>
                Download me
              </CSVLink>:null
              }
                <Button 
                    size='large'
                    onClick={()=>{
                        this.setState({
                            selectButton: 2
                        })
                        // this.signValues()
                    }} 
                    style={{width: '160px',
                        backgroundColor: this.state.selectButton === 2 ? UColor.thkblue : UColor.bg_color,
                        color: this.state.selectButton === 2 ? UColor.bg_color : UColor.thkfont_3
                    }}
                >
                <img src={this.state.selectButton === 2 ? require('../../image/iconbangding_bai.png') : require('../../image/iconbangding_hui.png')} 
                    style={{width: '16px', height: '16px',marginRight: '6px'}}
                />
                绑定地址</Button>
            </div>
        )
    }

    bottomItem(){
        return (
            <div className='bottoms'>
                <div className='bottomTwo'>
                    <p>提示：</p>
                    <p>当前版本：1.0.0</p>
                </div>
                <p>1、生成挖矿账户会生成脑密码和算力 ID</p>
                <p>2、生成绑定程序绑定了脑密码后才能开启挖矿</p>
                <p>3、挖矿程序需要绑定算力ID后才能生效</p>
            </div>
        )
    }

    render() {
        return (
            <div className='wraps'>
                {this.topTwoButton()}

                {this.state.selectButton === 1 ?
                this.createAccountItem()
                :this.state.selectButton === 2 ?
                this.bindDataItem():
                <div style={{height: '200px'}}></div>
                }

                {this.bottomItem()}
            </div>
        );
    }
}

export default CreateScreen;
