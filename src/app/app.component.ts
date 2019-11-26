import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private subscription: Subscription;
  topicname: any;
  msg: any;
  isConnected: boolean = false;
  @ViewChild('msglog') msglog: ElementRef;
  emptyP=["../assets/parkingC11.jpg","../assets/parkingC12.jpg","../assets/parkingC21.jpg","../assets/parkingC22.jpg"];
  pakinglot=[this.emptyP[0],this.emptyP[1],this.emptyP[2],this.emptyP[3]];
  parkingImg=["../assets/parkingTopE.jpg","../assets/parkingTopE1.jpg","../assets/parkingButtomE.jpg","../assets/parkingButtomE1.jpg"];

  constructor(private _mqttService: MqttService) { }

  ngOnInit(): void {
    this.subscribePark("park");
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  subscribeNewTopic(): void {
    console.log('inside subscribe new topic')
    this.subscription = this._mqttService.observe(this.topicname).subscribe((message: IMqttMessage) => {
      this.msg = message;
      console.log('msg: ', message)
      this.logMsg('Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
    });
    this.logMsg('subscribed to topic: ' + this.topicname)
  }

  sendmsg(): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish(this.topicname, this.msg, { qos: 1, retain: true })
    this.msg = ''
  }
  
  logMsg(message): void {
    this.msglog.nativeElement.innerHTML += '<br><hr>' + message;
  }

  clear(): void {
    this.msglog.nativeElement.innerHTML = '';
  }

  subscribePark(tp): void {
    console.log('inside subscribe new topic')
    this.subscription = this._mqttService.observe(tp).subscribe((message: IMqttMessage) => {
      this.msg = message;
      console.log('msg: ', message)
      this.logMsg('Message: ' + message.payload.toString() + '<br> for topic: ' + message.topic);
      if(message.payload.toString()=="c11 1"){
        this.pakinglot[0]=this.parkingImg[0]
      }
      else if(message.payload.toString()=="c11 0"){
        this.pakinglot[0]=this.emptyP[0]
      }
      if(message.payload.toString()=="c12 1"){
        this.pakinglot[1]=this.parkingImg[1]
      }
      else if(message.payload.toString()=="c12 0"){
        this.pakinglot[1]=this.emptyP[1]
      }
    });
    this.logMsg('subscribed to topic: ' + tp)
  }
}
