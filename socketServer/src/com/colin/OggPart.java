package com.colin;

public class OggPart {
		int loopTimes=0;
		int restDataLength=0;
		
		public void setLoopTimes(int loopTimes){
			this.loopTimes=loopTimes;
		}
		
		public void setRestDataLength(int restDataLength){
			this.restDataLength=restDataLength;
		}
		
		public int getLoopTimes(){
			return this.loopTimes;
		}
		
		public int getRestDataLength(){
			return this.restDataLength;
		}
}
