package io.ionic.starter;

import com.getcapacitor.BridgeActivity;

// public class MainActivity extends BridgeActivity {}
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BarcodePrinter.class);
        super.onCreate(savedInstanceState);
    }
}
