package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class ActivityC : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AppState.threadCounter.value += 10
        setContent {
            val pCount by AppState.pauseCounter.collectAsState()
            val dCount by AppState.destroyCounter.collectAsState()

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFF004d66))
                    .padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Image(
                        painter = painterResource(id = android.R.drawable.ic_menu_info_details),
                        contentDescription = null,
                        modifier = Modifier.size(64.dp)
                    )
                    Spacer(modifier = Modifier.width(16.dp))
                    Text("Activity C", color = Color.White, fontSize = 24.sp)
                }
                
                Spacer(modifier = Modifier.height(50.dp))
                
                Text(
                    text = "Activity C occupies the complete window real-estate. The Android OS forces Activity A to be Paused. However, the background thread keep incrementing the counter...",
                    color = Color.White,
                    fontSize = 18.sp
                )

                Spacer(modifier = Modifier.height(20.dp))
                Text("onPause() counter: $pCount", color = Color.White)
                Text("onDestroy() counter: $dCount", color = Color.White)

                Spacer(modifier = Modifier.weight(1f))

                Button(
                    onClick = { finish() },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Black),
                    shape = ShapeDefaults.ExtraSmall,
                    modifier = Modifier.fillMaxWidth(0.6f)
                ) {
                    Text("Finish C", color = Color.White)
                }
                
                Spacer(modifier = Modifier.height(50.dp))
            }
        }
    }

    override fun onPause() {
        super.onPause()
        AppState.pauseCounter.value++
    }

    override fun onDestroy() {
        super.onDestroy()
        AppState.destroyCounter.value++
    }
}
